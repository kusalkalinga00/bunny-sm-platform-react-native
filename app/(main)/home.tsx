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
import { Post, PostsRealtimePayload } from "@/types";

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(true);

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
        };

        setPosts((prevPosts) => [post, ...prevPosts]);
      }
    }
  };

  useEffect(() => {
    let postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostsEvent,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  return (
    <ScreenWrapper bg="#fff">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>BunnyUp</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/(main)/notifications")}>
              <Icon
                name="heart"
                size={heightPercentage(3.2)}
                color={theme.colors.text}
                strokeWidth={2}
              />
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
            console.log("End reached, fetching more posts...");
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
