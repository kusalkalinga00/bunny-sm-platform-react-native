import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";

export const getUserImageUrl = (path: string | null | undefined) => {
  if (path) {
    return {
      uri: path,
    };
  } else {
    return require("../assets/images/defaultUser.png");
  }
};

export const uploadFile = async (
  folderName: string,
  fileUri: string,
  isImage = true as boolean,
  fileName?: string
) => {
  try {
    let filePath = getFilePath(folderName, isImage, fileName);
    const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imageData = decode(fileBase64); // Convert base64 to ArrayBuffer

    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(filePath, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "image/jpeg" : "video/mp4",
      });

    if (error) {
      console.log("Error uploading file: ", error);
      return {
        success: false,
        msg: error.message,
      };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("uploads").getPublicUrl(filePath);

    console.log("File uploaded successfully: ", publicUrl);

    return {
      success: true,
      msg: "File uploaded successfully",
      data: publicUrl,
    };
  } catch (error) {
    console.log("Error uploading file: ", error);
    return {
      success: false,
      msg: "Error uploading file",
    };
  }
};

export const getFilePath = (
  folderName: string,
  isImage: boolean,
  fileName?: string
) => {
  if (fileName) {
    const ext = fileName.split(".").pop();
    return `${folderName}/${Date.now()}.${ext}`;
  }
  return `/${folderName}/${Date.now()}${isImage ? ".jpg" : ".mp4"}`;
};
