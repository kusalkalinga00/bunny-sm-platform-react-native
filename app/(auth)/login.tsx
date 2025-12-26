import Icon from "@/assets/icons";
import BackButton from "@/components/common/BackButton";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { theme } from "@/constants/theme";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

const login = () => {
  const router = useRouter();
  const emailRef = useRef<string>("");
  const passwordRef = useRef<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }
  };

  return (
    <ScreenWrapper bg="white">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <BackButton router={router} />

        <View>
          <Text style={styles.welcomeText}>Hey,</Text>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        <View style={styles.form}>
          <Text
            style={{
              fontSize: heightPercentage(1.5),
              color: theme.colors.text,
            }}
          >
            Please Login to continue
          </Text>

          <Input
            icon={<Icon name="mail" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your email"}
            onChangeText={(text: string) => (emailRef.current = text)}
          />

          <Input
            icon={<Icon name="lock" size={26} strokeWidth={1.6} />}
            placeholder={"Enter your password"}
            onChangeText={(text: string) => (passwordRef.current = text)}
            secureTextEntry={true}
          />

          <Text style={styles.forgotPassword}>Forgot Password ?</Text>

          <Button title="Login" loading={loading} onPress={onSubmit} />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Pressable onPress={() => router.push("/signUp")}>
            <Text
              style={[styles.footerText, { color: theme.colors.primaryDark }]}
            >
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 45,
    paddingHorizontal: widthPercentage(4),
  },
  welcomeText: {
    fontSize: heightPercentage(4),
    fontWeight: theme.fonts.bold,
    color: theme.colors.text,
  },

  form: {
    gap: 25,
  },

  forgotPassword: {
    textAlign: "right",
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },

  footerText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: heightPercentage(1.6),
  },
});
