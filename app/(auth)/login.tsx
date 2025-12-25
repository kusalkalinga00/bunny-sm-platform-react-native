import BackButton from "@/components/common/BackButton";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const login = () => {
  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View>
        <BackButton />
      </View>
      <Text>login</Text>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({});
