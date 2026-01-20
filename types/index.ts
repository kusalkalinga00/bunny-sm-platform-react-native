import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export type Profile = {
  name: string | null;
  phoneNumber: string | null;
  image: string | null;
  bio: string | null;
  address: string | null;
};

export type Likes = {
  created_at: string;
  id: number;
  postId: number;
  userId: string;
};

export type Comment = {
  created_at: string;
  id: number;
  postId: number;
  text: string;
  user: {
    id: string;
    image: string;
    name: string;
  };
  userId: string;
};

export type Comments = {
  comments: Comment[];
};

export type Post = {
  body: string;
  created_at: string;
  file: string | null;
  id: number;
  userId: string;
  user: {
    id: string;
    image: string;
    name: string;
  };
  postLikes?: Likes[];
  comments?: Comment[];
};

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

export type PostRecord = {
  id?: string;
  body: string;
  userId?: string;
  user_id?: string;
  file?: string | null;
};

export type PostRow = {
  body: string;
  created_at: string;
  file: string | null;
  id: number;
  userId: string;
};

export type PostsRealtimePayload = RealtimePostgresChangesPayload<PostRow>;
