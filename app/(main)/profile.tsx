import Icon from "@/assets/icons";
import Avatar from "@/components/common/Avatar";
import Header from "@/components/common/Header";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { theme } from "@/constants/theme";
import { AppUser, useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { supabase } from "@/lib/supabase";
import { Router, useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const profile = () => {
  const { user, setAuth } = useAuth();
  const router = useRouter();
  const handleLogOut = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Log Out",
        style: "destructive",
        onPress: () => onLogOut(),
      },
    ]);
  };

  const onLogOut = async () => {
    setAuth(null);
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Error", error.message);
    }
  };

  return (
    <ScreenWrapper bg="#ffffff">
      <UserHeader user={user} router={router} handleLogOut={handleLogOut} />
    </ScreenWrapper>
  );
};

const UserHeader = ({
  user,
  router,
  handleLogOut,
}: {
  user: AppUser | null;
  router: Router;
  handleLogOut: () => void;
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
        <Header title={"Profile"} showBackButton={true} mb={30} />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogOut}>
          <Icon name="logout" color={theme.colors.rose} />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View
          style={{
            gap: 15,
          }}
        >
          <View
            style={{
              gap: 15,
            }}
          >
            <View style={styles.avatarContainer}>
              <Avatar
                uri={user?.image}
                size={heightPercentage(12)}
                rounded={theme.radius.xxl * 1.4}
              />

              <Pressable
                style={styles.editIcon}
                onPress={() => router.push("/(main)/edit-profile")}
              >
                <Icon name="edit" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            {/* username and the address */}
            <View style={{ gap: 4, alignItems: "center" }}>
              <Text style={styles.userName}>{user && user.name}</Text>
              <Text style={styles.infoText}>{user && user.address}</Text>
            </View>

            {/* email , phone , bio */}
            <View style={{ gap: 10 }}>
              <View style={styles.info}>
                <Icon name="mail" size={18} color={theme.colors.textLight} />
                <Text style={styles.infoText}>{user && user.email}</Text>
              </View>
              {user && user.phone && (
                <View style={styles.info}>
                  <Icon name="call" size={18} color={theme.colors.textLight} />
                  <Text style={styles.infoText}>{user && user.phone}</Text>
                </View>
              )}
              {user && user.bio && (
                <Text style={styles.infoText}>{user && user.bio}</Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    marginHorizontal: widthPercentage(4),
    marginBottom: 20,
  },
  headerShape: {
    width: widthPercentage(100),
    height: heightPercentage(20),
  },
  avatarContainer: {
    height: heightPercentage(12),
    width: heightPercentage(12),
    alignSelf: "center",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: -12,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "#ffffff",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },

  userName: {
    fontSize: heightPercentage(3),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textDark,
  },

  info: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  infoText: {
    fontSize: heightPercentage(1.6),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  logoutButton: {
    position: "absolute",
    right: 0,
    padding: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: "#fee2e2",
  },
  listStyle: {
    paddingHorizontal: widthPercentage(4),
    paddingBottom: 30,
  },

  noPost: {
    fontSize: heightPercentage(2),
    textAlign: "center",
    color: theme.colors.text,
  },
});
