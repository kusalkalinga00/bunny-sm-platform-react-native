import ScreenWrapper from "@/components/common/ScreenWrapper";
import { useAuth } from "@/context/auth-context";
import { supabase } from "@/lib/supabase";
import React from "react";
import { Alert, Button, StyleSheet, Text } from "react-native";

const Home = () => {
  const { setAuth } = useAuth();

  const onLogOut = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <ScreenWrapper bg="#fff">
      <Text>home</Text>
      <Button title="log out" onPress={onLogOut} />
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
