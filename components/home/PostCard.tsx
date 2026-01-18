import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { AppUser } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { Post } from "@/types";
import { Image } from "expo-image";
import { Router } from "expo-router";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RenderHtml from "react-native-render-html";
import Avatar from "../common/Avatar";

interface PostCardProps {
  post: Post;
  currentUser: AppUser | null;
  router: Router;
  hasShadow: boolean;
}

const textStyles = {
  color: theme.colors.dark,
  fontSize: heightPercentage(1.75),
};

const tagsStyles = {
  div: textStyles,
  p: textStyles,
  ol: textStyles,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  post,
  currentUser,
  router,
  hasShadow = true,
}: PostCardProps) => {
  const shadowStyles = {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  };

  const createdAt = moment(post.created_at).format("MMM D");
  const liked = false;
  const likes = [];

  const openPostDetails = () => {};

  return (
    <View style={[styles.container, hasShadow && shadowStyles]}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Avatar
            size={heightPercentage(4.5)}
            uri={post.user.image}
            rounded={theme.radius.md}
          />

          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{post.user.name}</Text>
            <Text style={styles.postItem}>{createdAt}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={openPostDetails}>
          <Icon
            name="threeDotsHorizontal"
            size={heightPercentage(3.4)}
            strokeWidth={3}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.postBody}>
          {post.body && (
            <RenderHtml
              contentWidth={widthPercentage(100)}
              source={{ html: post.body }}
              tagsStyles={tagsStyles}
            />
          )}
        </View>

        {post.file && (
          <Image
            source={post.file}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
            contentPosition={"center"}
          />
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon
              name="heart"
              size={24}
              color={liked ? theme.colors.rose : theme.colors.text}
              fill={liked ? theme.colors.rose : "none"}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="comment" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity>
            <Icon name="share" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xxl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: heightPercentage(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postItem: {
    fontSize: heightPercentage(1.7),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: heightPercentage(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    color: theme.colors.text,
    fontSize: heightPercentage(1.8),
  },
});
