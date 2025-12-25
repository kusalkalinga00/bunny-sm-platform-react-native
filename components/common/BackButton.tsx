import Icon from "@/assets/icons/index";
import { theme } from "@/constants/theme";
import { Router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

const BackButton = ({
  size = 24,
  router,
}: {
  size?: number;
  router: Router;
}) => {
  return (
    <Pressable onPress={() => router.back()} style={styles.button}>
      <Icon
        name={"arrowLeft"}
        strokeWidth={2.5}
        size={size}
        color={theme.colors.text}
      />
    </Pressable>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  button: {
    alignSelf: "flex-start",
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "rgba(0,0,0,0.07)",
  },
});
