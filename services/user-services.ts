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
