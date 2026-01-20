import Icon from "@/assets/icons";
import { theme } from "@/constants/theme";
import { heightPercentage } from "@/helpers/common";
import { Comment } from "@/types";
import moment from "moment";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Avatar from "../common/Avatar";

interface CommentProps {
  comment: Comment;
  canDelete: boolean;
  onDelete: () => void;
}

const CommentItem = ({
  comment,
  canDelete = false,
  onDelete,
}: CommentProps) => {
  const createdAt = moment(comment.created_at).format("MMM d");

  const handleDeleteComment = () => {
    Alert.alert("Confirm", "Are you sure you want to delete this comment?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {
          console.log("modal canceled");
        },
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Avatar size={40} uri={comment?.user?.image} />
      <View style={styles.content}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={styles.nameContainer}>
            <Text style={styles.text}>{comment?.user?.name}</Text>
            <Text>.</Text>
            <Text style={[styles.text, { color: theme.colors.textLight }]}>
              {createdAt}
            </Text>
          </View>

          {canDelete && (
            <TouchableOpacity onPress={handleDeleteComment}>
              <Icon name="delete" size={20} color={theme.colors.rose} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={[styles.text, { fontWeight: "normal" }]}>
          {comment?.text}
        </Text>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    gap: 7,
  },

  content: {
    backgroundColor: "rgba(0,0,0,0.06)",
    flex: 1,
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderCurve: "continuous",
  },
  highlight: {
    borderWidth: 0.2,
    backgroundColor: "#ffffff",
    borderColor: theme.colors.dark,
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  text: {
    fontSize: heightPercentage(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },
});
