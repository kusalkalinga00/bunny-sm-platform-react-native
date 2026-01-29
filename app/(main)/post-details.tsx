import Icon from "@/assets/icons";
import Input from "@/components/common/Input";
import Loading from "@/components/common/Loading";
import PostCard from "@/components/home/PostCard";
import CommentItem from "@/components/post-details/Comment";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import {
  createPostComment,
  fetchPostDetails,
  removePost,
  removePostComment,
} from "@/services/posts-services";
import { getUserData } from "@/services/user-services";
import { Comment, CommentRow, CommentsRealtimePayload, Post } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = React.useRef<string>(null);
  const commentRef = React.useRef<string>("");
  const [loading, setLoading] = useState(false);

  const handleNewComment = async (payload: CommentsRealtimePayload) => {
    console.log("New comment payload: ", payload.new);
    if (!payload.new) return;

    const row = payload.new as Partial<CommentRow>;
    if (
      row.id == null ||
      row.postId == null ||
      row.userId == null ||
      row.text == null ||
      row.created_at == null
    ) {
      return;
    }

    const safeRow = row as CommentRow;

    // Fetch user data for the comment
    const res = await getUserData(safeRow.userId);
    const resolvedUser = res.success
      ? ({
          id: res.data?.id,
          image: res.data?.image,
          name: res.data?.name,
        } as Comment["user"])
      : ({ id: safeRow.userId, image: "", name: "Unknown" } as Comment["user"]);

    const newComment: Comment = {
      id: safeRow.id,
      postId: safeRow.postId,
      userId: safeRow.userId,
      text: safeRow.text,
      created_at: safeRow.created_at,
      user: resolvedUser,
    };

    // Update post state with the new comment
    setPost((prevPost) => {
      if (!prevPost) return prevPost;
      return {
        ...prevPost,
        comments: [newComment, ...(prevPost.comments || [])],
      };
    });
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel(`comments:post:${postId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment,
      )
      .subscribe();

    getPostDetails();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const getPostDetails = async () => {
    // Fetch post details using postId
    // Set the post state

    const res = await fetchPostDetails(Number(postId));
    if (res.success) {
      setPost(res.data);
    }
    setStartLoading(false);
  };

  const addNewComment = async () => {
    if (!commentRef.current) return;

    const data = {
      userId: user?.id!,
      postId: Number(postId),
      text: commentRef.current,
    };

    setLoading(true);
    // Call service to add comment
    const res = await createPostComment(data);
    setLoading(false);
    if (res.success) {
      // send notification to post owner about new comment
      // Clear input field
      if (inputRef.current) {
        inputRef.current = "";
        commentRef.current = "";
      }
    } else {
      Alert.alert("Error", res.msg || "Could not add the comment.");
    }
  };

  const onDeleteComment = async (comment: Comment) => {
    console.log("deleting comment : ", comment);
    const res = await removePostComment(comment.id);
    console.log("remove comment res: ", res);

    if (res.success) {
      // Refresh post details to reflect deleted comment
      setPost((prevPost) => {
        if (!prevPost) return prevPost;
        return {
          ...prevPost,
          comments: prevPost.comments!.filter((c) => c.id !== comment.id),
        };
      });
    } else {
      Alert.alert("Error", res.msg || "Could not delete the comment.");
    }
  };

  const onDeletePost = async (post: Post) => {
    const res = await removePost(post.id);
    if (res.success) {
      router.back();
    } else {
      Alert.alert("Error", res.msg || "Could not delete the post.");
    }
  };

  const onEditPost = async (post: Post) => {
    console.log("editing post : ", post);
  };

  if (startLoading) {
    return (
      <View style={styles.center}>
        <View style={styles.loading}>
          <Loading size="large" />
        </View>
      </View>
    );
  }

  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFound}>Post not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {post && (
          <PostCard
            post={post}
            currentUser={user}
            router={router}
            hasShadow={false}
            showMoreIcon={false}
            showDeleteIcon={true}
            onDelete={onDeletePost}
            onEdit={onEditPost}
          />
        )}

        {/* comments  */}
        <View style={styles.inputContainer}>
          <Input
            placeholder="Add a comment..."
            placeholderTextColor={theme.colors.textLight}
            containerStyle={{
              flex: 1,
              height: heightPercentage(6.2),
              borderRadius: theme.radius.xl,
            }}
            inputRef={inputRef}
            onChangeText={(value: string) => (commentRef.current = value)}
          />

          {loading ? (
            <View style={styles.loading}>
              <Loading size="small" />
            </View>
          ) : (
            <TouchableOpacity style={styles.sendIcon} onPress={addNewComment}>
              <Icon name="send" color={theme.colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        {/* comment list */}
        <View style={{ marginVertical: 15, gap: 17 }}>
          {post?.comments?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              canDelete={
                user?.id === comment.userId || user?.id === post.userId
              }
              onDelete={onDeleteComment}
            />
          ))}

          {post?.comments?.length === 0 && (
            <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
              No comments yet. Be the first to comment!
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingVertical: widthPercentage(2),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: widthPercentage(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: heightPercentage(5.8),
    width: heightPercentage(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: heightPercentage(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: heightPercentage(5.8),
    width: widthPercentage(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
