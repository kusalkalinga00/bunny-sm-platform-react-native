import { supabase } from "@/lib/supabase";

export const getUserData = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return {
        success: false,
        msg: error.message,
        data: null,
      };
    }

    return {
      success: true,
      msg: "User data fetched successfully",
      data,
    };
  } catch (error: any) {
    console.log("Error fetching user data: ", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const updateUserData = async (userId: string, data: any) => {
  try {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);

    if (error) {
      return {
        success: false,
        msg: error.message,
        data: null,
      };
    }

    return {
      success: true,
      msg: "User data updated successfully",
      data,
    };
  } catch (error: any) {
    console.log("Error updating user data: ", error);
    return {
      success: false,
      msg: error.message,
    };
  }
};
