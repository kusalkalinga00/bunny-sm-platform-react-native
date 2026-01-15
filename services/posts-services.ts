import { supabase } from "@/lib/supabase";
import { uploadFile } from "./image-services";

export type ServiceResult<T> =
  | { success: true; data: T; msg?: string }
  | { success: false; msg: string; data?: null };

export type FileLike = { uri: string };

export type CreateOrUpdatePostInput = {
  id?: string;
  body: string;
  userId: string;
  file?: FileLike | string | null;
};

type PostRecord = {
  id?: string;
  body: string;
  userId?: string;
  user_id?: string;
  file?: string | null;
};

const getMissingColumnName = (error: any): string | null => {
  const message: unknown = error?.message;
  if (typeof message !== "string") return null;
  const match = message.match(/Could not find the '([^']+)' column/);
  return match?.[1] ?? null;
};

export const createOrUpdatePost = async (
  input: CreateOrUpdatePostInput
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
