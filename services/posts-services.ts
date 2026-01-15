import { supabase } from "@/lib/supabase";
import { uploadFile } from "./image-services";

export const createOrUpdatePost = async (post: any) => {
  try {
    if (post.file && typeof post.file === "object") {
      let folderName = "postImages";
      let fileResult = await uploadFile(folderName, post.file.uri);

      if (fileResult.success) {
        post.imageUrl = fileResult.data;
      } else {
        return fileResult;
      }
    }
    

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.log("create post error", error);
      return {
        success: false,
        msg: "Failed to create post. ",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("create post error", error);
    return {
      success: false,
      msg: "An error occurred while creating the post.",
    };
  }
};
