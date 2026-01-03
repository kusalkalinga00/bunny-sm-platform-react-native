import { theme } from "@/constants/theme";
import { heightPercentage } from "@/helpers/common";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, type ImageStyle, type StyleProp } from "react-native";

export type AvatarProps = {
  uri?: string | null;
  size?: number;
  rounded?: number;
  style?: StyleProp<ImageStyle>;
};

const Avatar = ({
  uri,
  size = heightPercentage(4.5),
  rounded = theme.radius.md,
  style,
}: AvatarProps) => {
  return (
    <Image
      source={uri ? { uri } : undefined}
      style={[{ width: size, height: size, borderRadius: rounded }, style]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({});
