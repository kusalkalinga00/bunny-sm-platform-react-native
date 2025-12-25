import Icon from "@/assets/icons/index";
import { theme } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet } from "react-native";

const BackButton = ({ size = 24 }: { size?: number }) => {
  return (
    <Pressable>
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

const styles = StyleSheet.create({});
