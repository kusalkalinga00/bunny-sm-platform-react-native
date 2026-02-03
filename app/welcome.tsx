import Button from "@/components/common/Button";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { theme } from "@/constants/theme";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const welcome = () => {
  const router = useRouter();

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>BunnyUp!</Text>
          <Text style={styles.punchline}>
            Discover freedom and flexibility with our app, designed to make your
            life easier.
          </Text>
        </View>
        <Image
          style={styles.welcomeImage}
          source={require("../assets/images/welcome.svg")}
          contentFit="contain"
        />

        <View style={styles.footer}>
          <Button
            title="Getting Started"
            buttonStyle={{
              marginHorizontal: widthPercentage(3),
            }}
            textStyle={{}}
            onPress={() => router.push("/signUp")}
            loading={false}
            hasShadow={true}
          />

          <View style={styles.bottomTextContainer}>
            <Text>Already have an account?</Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semiBold,
                  },
                ]}
              >
                LogIn
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: widthPercentage(4),
  },
  welcomeImage: {
    height: heightPercentage(30),
    width: widthPercentage(100),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: heightPercentage(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  punchline: {
    textAlign: "center",
    paddingHorizontal: widthPercentage(10),
    color: theme.colors.text,
    fontSize: heightPercentage(1.7),
    fontWeight: theme.fonts.medium,
  },

  footer: {
    width: "100%",
    gap: 30,
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontWeight: theme.fonts.bold,
    fontSize: heightPercentage(1.6),
  },
});
