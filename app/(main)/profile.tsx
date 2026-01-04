import Header from "@/components/common/Header";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { AppUser, useAuth } from "@/context/auth-context";
import { widthPercentage } from "@/helpers/common";
import { Router, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

const profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();

  return (
    <ScreenWrapper bg="#ffffff">
      <UserHeader user={user} router={router} />
    </ScreenWrapper>
  );
};

const UserHeader = ({
  user,
  router,
}: {
  user: AppUser | null;
  router: Router;
}) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        paddingHorizontal: widthPercentage(4),
      }}
    >
      <View>
        <Header title={"Profile"} showBackButton={true} />
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({});
