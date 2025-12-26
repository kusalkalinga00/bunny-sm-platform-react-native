import { theme } from "@/constants/theme";
import { heightPercentage } from "@/helpers/common";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

const Input = (props: any) => {
  return (
    <View
      style={[styles.container, props.ContainerStyles && props.ContainerStyles]}
    >
      {props.icon && props.icon}
      <TextInput
        style={{
          flex: 1,
        }}
        placeholderTextColor={theme.colors.textLight}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: heightPercentage(7.2),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    paddingHorizontal: 15,
    gap: 12,
  },
});
