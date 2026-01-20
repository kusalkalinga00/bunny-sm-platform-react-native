import Icon from "@/assets/icons";
import Input from "@/components/common/Input";
import Loading from "@/components/common/Loading";
import PostCard from "@/components/home/PostCard";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { fetchPostDetails } from "@/services/posts-services";
import { Post } from "@/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const { user } = useAuth();
  const router = useRouter();
  const [startLoading, setStartLoading] = useState(true);
  const inputRef = React.useRef<string>(null);
  const commentRef = React.useRef<string>("");

  useEffect(() => {
    getPostDetails();
  }, []);

  const getPostDetails = async () => {
    // Fetch post details using postId
    // Set the post state

    const res = await fetchPostDetails(Number(postId));
    console.log("Post Details:", res);
    if (res.success) {
      setPost(res.data);
      setStartLoading(false);
    }
  };

  const addNewComment = async () => {};

  if (startLoading) {
    return (
      <View style={styles.center}>
        <View style={styles.loading}>
          <Loading size="large" />
        </View>
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

          <TouchableOpacity style={styles.sendIcon} onPress={addNewComment}>
            <Icon name="send" color={theme.colors.primary} />
          </TouchableOpacity>
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
