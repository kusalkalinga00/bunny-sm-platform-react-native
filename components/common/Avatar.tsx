import { theme } from "@/constants/theme";
import { heightPercentage } from "@/helpers/common";
import { getUserImageUrl } from "@/services/image-services";
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
      source={getUserImageUrl(uri)}
      transition={100}
      style={[
        { width: size, height: size, borderRadius: rounded },
        style,
        styles.avatar,
      ]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: "continuous",
    borderColor: theme.colors.darkLight,
    borderWidth: 1,
  },
});
