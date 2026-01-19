import { supabase } from "@/lib/supabase";
import {
  CreateOrUpdatePostInput,
  Post,
  PostRecord,
  ServiceResult,
} from "@/types";
import { uploadFile } from "./image-services";

const getMissingColumnName = (error: any): string | null => {
  const message: unknown = error?.message;
  if (typeof message !== "string") return null;
  const match = message.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
};

export const createOrUpdatePost = async (
  input: CreateOrUpdatePostInput,
): Promise<ServiceResult<unknown>> => {
  try {
    let uploadedFileUrl: string | null | undefined = undefined;

    if (input.file) {
      if (typeof input.file === "string") {
        uploadedFileUrl = input.file;
      } else if (typeof input.file === "object" && "uri" in input.file) {
        const folderName = "postImages";
        const fileResult = await uploadFile(folderName, input.file.uri);
        if (!fileResult.success) {
          return {
            success: false,
            msg: fileResult.msg ?? "Failed to upload file.",
          };
        }
        uploadedFileUrl = fileResult.data as string;
      }
    }

    const basePayload: PostRecord = {
      ...(input.id ? { id: input.id } : {}),
      body: input.body,
      userId: input.userId,
      ...(typeof uploadedFileUrl === "string" ? { file: uploadedFileUrl } : {}),
    };

    const attemptUpsert = async (payload: PostRecord) => {
      return await supabase.from("posts").upsert(payload).select().single();
    };

    let { data, error } = await attemptUpsert(basePayload);

    // Common fix-ups: camelCase vs snake_case column names
    if (error?.code === "PGRST204") {
      const missing = getMissingColumnName(error);
      if (missing === "userId") {
        const retryPayload: PostRecord = { ...basePayload };
        retryPayload.user_id = input.userId;
        delete retryPayload.userId;
        ({ data, error } = await attemptUpsert(retryPayload));
      }
    }

    if (error) {
      console.log("create post error", error);
      return {
        success: false,
        msg: error.message || "Failed to create post.",
      };
    }

    return { success: true, data };
  } catch (error) {
    console.log("create post error", error);
    return {
      success: false,
      msg: "An error occurred while creating the post.",
    };
  }
};

export const fetchPosts = async (
  limit = 10,
): Promise<ServiceResult<Post[]>> => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        ` *,
        user: users (id, name, image),
        postLikes : post_likes (*)`,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.log("fetch posts error", error);
      return {
        success: false,
        msg: error.message || "Failed to fetch posts.",
      };
    }
    return { success: true, data: data || [] };
  } catch (error) {
    console.log("fetch posts error", error);
    return {
      success: false,
      msg: "An error occurred while fetching the posts.",
    };
  }
};

export const createPostLike = async (postLike: {
  postId: number;
  userId: string;
}): Promise<ServiceResult<any>> => {
  try {
    const { data, error } = await supabase
      .from("post_likes")
      .insert(postLike)
      .select()
      .single();

    if (error) {
      console.log("post like error", error);
      return {
        success: false,
        msg: error.message || "Could not like the post.",
      };
    }

    return { success: true, data: data || [] };
  } catch (error) {
    console.log("post like error", error);
    return {
      success: false,
      msg: "An error occurred while liking the post.",
    };
  }
};

export const removePostLike = async (
  postId: number,
  userId: string,
): Promise<ServiceResult<any>> => {
  try {
    const { error, data } = await supabase
      .from("post_likes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (error) {
      console.log("post like remove error", error);
      return {
        success: false,
        msg: error.message || "Could not remove the like from the post.",
      };
    }

    return { success: true, data: data };
  } catch (error) {
    console.log("post like remove error", error);
    return {
      success: false,
      msg: "An error occurred while removing the like from the post.",
    };
  }
};
