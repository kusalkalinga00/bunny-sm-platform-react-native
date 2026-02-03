import Icon from "@/assets/icons";
import Avatar from "@/components/common/Avatar";
import Loading from "@/components/common/Loading";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import PostCard from "@/components/home/PostCard";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { fetchPosts } from "@/services/posts-services";
import { getUserData } from "@/services/user-services";
import {
  Comment,
  CommentRow,
  CommentsRealtimePayload,
  Post,
  PostsRealtimePayload,
} from "@/types";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  const getPosts = async () => {
    if (!hasMore) return null;

    let res = await fetchPosts(limit);
    if (res.success && res.data) {
      if (posts.length === res.data.length) {
        setHasMore(false);
      }
      setPosts(res.data);
      setLimit(limit + 4);
    }
  };

  const handlePostsEvent = async (payload: PostsRealtimePayload) => {
    if (payload.eventType === "INSERT" && payload.new.id) {
      let newPost = { ...payload.new };

      let userRes = await getUserData(payload.new.userId);

      if (userRes.success && userRes.data) {
        let post: Post = {
          body: newPost.body,
          created_at: newPost.created_at,
          file: newPost.file,
          id: newPost.id,
          userId: newPost.userId,
          user: {
            id: userRes.data.id,
            image: userRes.data.image || "",
            name: userRes.data.name || "Unknown",
          },
          postLikes: [],
          comments: [],
        };

        setPosts((prevPosts) => [post, ...prevPosts]);
      }
    }

    if (payload.eventType === "DELETE" && payload.old.id) {
      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== payload.old.id),
      );
    }

    if (payload.eventType === "UPDATE" && payload.new.id) {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id !== payload.new.id) return post;
          return {
            ...post,
            body: payload.new.body,
            file: payload.new.file,
          };
        }),
      );
    }
  };

  const handleNotificationEvent = async (payload: any) => {
    console.log("New notification received:", payload);
    if (payload.eventType === "INSERT" && payload.new.id) {
      setNotificationCount((prevCount) => prevCount + 1);
    }
  };

  useEffect(() => {
    const postChannel = supabase
      .channel("posts:feed")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostsEvent,
      )
      .subscribe();

    const notificationChannel = supabase
      .channel("notifications:feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user?.id}`,
        },
        handleNotificationEvent,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
      supabase.removeChannel(notificationChannel);
    };
  }, []);

  const handleCommentInsert = (payload: CommentsRealtimePayload) => {
    const row = payload.new as Partial<CommentRow> | null;
    if (!row || row.id == null || row.postId == null || row.userId == null) {
      return;
    }

    const comment: Comment = {
      id: row.id,
      postId: row.postId,
      userId: row.userId,
      text: typeof row.text === "string" ? row.text : "",
      created_at:
        typeof row.created_at === "string"
          ? row.created_at
          : new Date().toISOString(),
      user: {
        id: row.userId,
        image: "",
        name: "Unknown",
      },
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== comment.postId) return post;

        const existing = post.comments || [];
        if (existing.some((c) => c.id === comment.id)) return post;

        return {
          ...post,
          comments: [comment, ...existing],
        };
      }),
    );
  };

  const handleCommentDelete = (payload: any) => {
    const deletedId = payload?.old?.id;
    if (deletedId == null) return;

    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (!post.comments?.length) return post;
        if (!post.comments.some((c) => c.id === deletedId)) return post;
        return {
          ...post,
          comments: post.comments.filter((c) => c.id !== deletedId),
        };
      }),
    );
  };

  useEffect(() => {
    const postsComment = supabase
      .channel("comments:feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
        },
        handleCommentInsert,
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "comments",
        },
        handleCommentDelete,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsComment);
    };
  }, []);

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <ScreenWrapper bg="#fff">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BunnyUp</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                router.push("/(main)/notifications");
              }}
            >
              <Icon
                name="heart"
                size={heightPercentage(3.2)}
                color={theme.colors.text}
                strokeWidth={2}
              />

              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>

            <Pressable onPress={() => router.push("/(main)/new-post")}>
              <Icon
                name="plus"
                size={heightPercentage(3.2)}
                color={theme.colors.text}
                strokeWidth={2}
              />
            </Pressable>

            <Pressable onPress={() => router.push("/(main)/profile")}>
              {/* <Icon
                name="user"
                size={heightPercentage(3.2)}
                color={theme.colors.text}
                strokeWidth={2}
              /> */}
              <Avatar
                uri={user?.image}
                size={heightPercentage(4.3)}
                rounded={theme.radius.sm}
                style={{
                  borderWidth: 2,
                }}
              />
            </Pressable>
          </View>
        </View>

        {/* posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(items) => items.id.toString()}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              currentUser={user}
              router={router}
              hasShadow={true}
              showMoreIcon={true}
              showDeleteIcon={false}
            />
          )}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>No more posts to display.</Text>
              </View>
            )
          }
          onEndReached={() => {
            getPosts();
          }}
          onEndReachedThreshold={0}
        />
      </View>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: widthPercentage(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: heightPercentage(3.2),
    fontWeight: theme.fonts.bold,
  },
  avatarImage: {
    height: heightPercentage(4.3),
    width: heightPercentage(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: widthPercentage(4),
  },
  noPosts: {
    fontSize: heightPercentage(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -5,
    height: heightPercentage(2.2),
    width: heightPercentage(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "#ffffff",
    fontSize: heightPercentage(1.2),
    fontWeight: theme.fonts.bold,
  },
});
