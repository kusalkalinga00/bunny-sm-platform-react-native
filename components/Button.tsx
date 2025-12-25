import Loading from "@/components/Loading";
import { theme } from "@/constants/theme";
import { heightPercentage } from "@/helpers/common";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const Button = ({
  buttonStyle,
  textStyle,
  title = "",
  onPress = () => {},
  loading = false,
  hasShadow = true,
}: {
  buttonStyle: object;
  textStyle: object;
  title: string;
  onPress: () => void;
  loading: boolean;
  hasShadow?: boolean;
}) => {
  const shadowStyle = {
    shadowColor: theme.colors.dark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  };

  if (loading) {
    return (
      <View style={[styles.button, buttonStyle, { backgroundColor: "white" }]}>
        <Loading />
      </View>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, buttonStyle, hasShadow && shadowStyle]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.primary,
    height: heightPercentage(6.6),
    justifyContent: "center",
    alignItems: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
  },
  text: {
    color: "white",
    fontSize: heightPercentage(2.5),
    fontWeight: theme.fonts.bold,
  },
});
