import Loading from "@/components/common/Loading";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

const index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper bg="white">
      {/* <Text>index</Text>
      <Button title="Welcome" onPress={() => router.push("/welcome")} /> */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    </ScreenWrapper>
  );
};

export default index;
