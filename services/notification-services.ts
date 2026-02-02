import { supabase } from "@/lib/supabase";
import { Notification, ServiceResult } from "@/types";

export const createNotification = async (
  notification: Notification,
): Promise<ServiceResult<Notification>> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.log("notification error", error);
      return {
        success: false,
        msg: error.message || "Could not create the notification.",
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.log("notification error", error);
    return {
      success: false,
      msg: "An error occurred while creating the notification.",
    };
  }
};

export const fetchNotifications = async (
  receiverId: string,
): Promise<ServiceResult<Notification[]>> => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        ` *,
          sender: senderId(id, name, image)
        `,
      )
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log("fetch notifications error", error);
      return {
        success: false,
        msg: error.message || "Failed to fetch notifications.",
      };
    }
    return { success: true, data: data || [] };
  } catch (error) {
    console.log("fetch notifications error", error);
    return {
      success: false,
      msg: "An error occurred while fetching the notifications.",
    };
  }
};
