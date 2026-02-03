import { theme } from "@/constants/theme";
import { heightPercentage } from "@/helpers/common";
import { Notification } from "@/types";
import { Router } from "expo-router";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../common/Avatar";

const NotificationItem = ({
  notification,
  router,
}: {
  notification: Notification;
  router: Router;
}) => {
  const OpenPostDetails = async () => {
    const { postId, commentId } = JSON.parse(notification.data);
    router.push({
      pathname: "/(main)/post-details",
      params: { postId, commentId },
    });
  };

  const createdAt = moment(notification.created_at).format("MMM d");

  return (
    <TouchableOpacity style={styles.container} onPress={OpenPostDetails}>
      <Avatar
        uri={notification.sender!.image || ""}
        size={heightPercentage(5)}
        rounded={20}
      />

      <View style={styles.nameTitle}>
        <Text style={styles.text}>{notification.sender!.name}</Text>
        <Text style={[styles.text, { color: theme.colors.textDark }]}>
          {notification.title}
        </Text>
      </View>
      <Text style={[styles.text, { color: theme.colors.textLight }]}>
        {createdAt}
      </Text>
    </TouchableOpacity>
  );
};

export default NotificationItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    backgroundColor: "#ffffff",
    borderWidth: 0.5,
    borderColor: theme.colors.darkLight,
    padding: 15,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
  },

  nameTitle: {
    flex: 1,
    gap: 2,
  },

  text: {
    fontSize: heightPercentage(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
  },
});
