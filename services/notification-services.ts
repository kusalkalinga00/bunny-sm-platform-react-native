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
