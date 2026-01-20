import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { AppUser } from "@/context/auth-context";
import {
  heightPercentage,
  stripHTMLTags,
  widthPercentage,
} from "@/helpers/common";
import { downloadFile } from "@/services/image-services";
import { createPostLike, removePostLike } from "@/services/posts-services";
import { Likes, Post } from "@/types";
import { Image } from "expo-image";
import { Router } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RenderHtml from "react-native-render-html";
import Avatar from "../common/Avatar";
import Loading from "../common/Loading";

interface PostCardProps {
  post: Post;
  currentUser: AppUser | null;
  router: Router;
  hasShadow: boolean;
  showMoreIcon: boolean;
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
  showMoreIcon = true,
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
  const [likes, setLikes] = useState<Likes[]>([]);
  const [sharingLoading, setSharingLoading] = useState(false);

  const liked = likes.filter((like) => like.userId === currentUser?.id)[0]
    ? true
    : false;

  const openPostDetails = () => {
    if (showMoreIcon === false) return;
    router.push({
      pathname: "/post-details",
      params: { postId: post.id },
    });
  };

  const onLike = async () => {
    if (liked) {
      // removed the like
      let response = await removePostLike(post.id, currentUser?.id!);

      if (response.success) {
        setLikes((prevLikes) =>
          prevLikes.filter((like) => like.userId !== currentUser?.id),
        );
      } else {
        Alert.alert("Error", response.msg || "Could not unlike the post.");
      }
      return;
    } else {
      let data = {
        postId: post.id,
        userId: currentUser?.id!,
      };

      let response = await createPostLike(data);
      if (response.success) {
        setLikes((prevLikes) => [...prevLikes, response.data]);
        return;
      } else {
        Alert.alert("Error", response.msg || "Could not like the post.");
      }
    }
  };

  const onShare = async () => {
    const content = {
      message: stripHTMLTags(post.body) || "Check out this post!",
      url: post.file || undefined,
    };

    if (post.file) {
      setSharingLoading(true);
      let uri = await downloadFile(post.file);
      setSharingLoading(false);
      if (uri) {
        content.url = uri;
      }
    }
    Share.share(content);
  };

  useEffect(() => {
    setLikes(post.postLikes || []);
  }, [post]);

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

        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name="threeDotsHorizontal"
              size={heightPercentage(3.4)}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
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
          <TouchableOpacity onPress={onLike}>
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
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name="comment" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.count}>0</Text>
        </View>
        <View style={styles.footerButton}>
          {sharingLoading ? (
            <Loading size={"small"} />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name="share" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          )}
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
