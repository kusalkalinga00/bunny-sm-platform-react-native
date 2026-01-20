import { fetchPostDetails } from "@/services/posts-services";
import { Post } from "@/types";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);

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
    }
  };

  return (
    <View>
      <Text>PostDetails</Text>
    </View>
  );
};

export default PostDetails;

const styles = StyleSheet.create({});
