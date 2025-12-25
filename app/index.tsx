import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Text } from "react-native";

const index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      <Text>index</Text>
      <Button title="Welcome" onPress={() => router.push("/welcome")} />
    </ScreenWrapper>
  );
};

export default index;
