import Header from "@/components/common/Header";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import NotificationItem from "@/components/notifications/NotificationItem";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { fetchNotifications } from "@/services/notification-services";
import { Notification } from "@/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const notifications = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const response = await fetchNotifications(user?.id || "");

    console.log("notifications response", response.data);

    if (response.success) {
      setNotifications(response.data);
    }
  };
  return (
    <ScreenWrapper bg="#ffffff">
      <View style={styles.container}>
        <Header title="Notifications" showBackButton />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
        >
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              router={router}
            />
          ))}
          {notifications.length === 0 && (
            <View style={{ marginTop: heightPercentage(4) }}>
              <Text style={styles.noData}>No notifications found.</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercentage(4),
  },
  listStyle: {
    paddingVertical: 20,
    gap: 10,
  },
  noData: {
    fontSize: heightPercentage(1.8),
    fontWeight: theme.fonts.medium,
    color: theme.colors.text,
    textAlign: "center",
  },
});
