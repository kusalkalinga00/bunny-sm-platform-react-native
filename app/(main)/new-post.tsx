import Icon from "@/assets/icons";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import TextEditor from "@/components/common/TextEditor";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { createOrUpdatePost } from "@/services/posts-services";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const newPost = () => {
  const post = useLocalSearchParams();
  const { user } = useAuth();
  const bodyRef = useRef<string>("");
  const editorRef = useRef<any>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<
    ImagePicker.ImagePickerAsset | null | string
  >(null);

  useEffect(() => {
    console.log("edit post data : ", post);

    if (post.body && post.id) {
      bodyRef.current = post.body as string;

      // Try with a longer delay
      setTimeout(() => {
        console.log("Setting content:", post.body);
        editorRef.current?.setContentHTML(post.body);
      }, 300);
    }

    if (post.file) {
      setFile(post.file as string);
    }
  }, [post]);

  const onPick = async (isPick: boolean) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const getFileUri = (file: ImagePicker.ImagePickerAsset | string) => {
    if (file === null || file === "") return null;

    if (typeof file === "string") {
      return file;
    } else {
      return file.uri;
    }
  };

  const handleOnSubmit = async () => {
    if (!bodyRef.current) {
      Alert.alert("Create Post", "Post content cannot be empty.");
      return;
    }

    if (!user?.id) {
      Alert.alert("Create Post", "You must be logged in to post.");
      return;
    }

    const data = {
      ...(post.id ? { id: post.id as string } : {}),
      file,
      body: bodyRef.current,
      userId: user.id as string,
    };

    // create post
    setLoading(true);
    let res = await createOrUpdatePost(data);
    console.log("create post response", res);
    setLoading(false);

    if (res.success) {
      setFile(null);
      bodyRef.current = "";
      editorRef.current.setContentHTML("");
      router.back();
    } else {
      Alert.alert("Create Post", res.msg);
    }
  };

  return (
    <ScreenWrapper bg="#ffffff">
      <View style={styles.container}>
        <Header title="Create Post" showBackButton />
        <ScrollView contentContainerStyle={{ gap: 20 }}>
          <View style={styles.header}>
            <Avatar
              uri={user?.image}
              size={heightPercentage(6.5)}
              rounded={theme.radius.xl}
            />
            <View style={{ gap: 2 }}>
              <Text style={styles.username}>{user?.name}</Text>
              <Text style={styles.publicText}>Public</Text>
            </View>
          </View>

          <View style={styles.textEditor}>
            <TextEditor
              editorRef={editorRef}
              onChange={(body) => {
                bodyRef.current = body;
              }}
              initialContentHTML={post.body as string}
            />
          </View>

          {file && (
            <View style={styles.file}>
              <Image
                source={{ uri: getFileUri(file)! }}
                style={{ flex: 1 }}
                contentPosition={"center"}
                contentFit="cover"
              />

              <Pressable style={styles.closeIcon} onPress={() => setFile(null)}>
                <Icon name="delete" size={22} color={"white"} />
              </Pressable>
            </View>
          )}

          <View style={styles.media}>
            <Text style={styles.addImageText}>Add to your post</Text>
            <View style={styles.mediaIcons}>
              <TouchableOpacity onPress={() => onPick(true)}>
                <Icon name="image" size={38} color={theme.colors.dark} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Button
          buttonStyle={{ height: heightPercentage(6.2) }}
          title={post && post.id ? "Update Post" : "Post"}
          loading={loading}
          hasShadow={false}
          onPress={handleOnSubmit}
        />
      </View>
    </ScreenWrapper>
  );
};

export default newPost;

const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
    borderRadius: theme.radius.md,
    backgroundColor: "rgba(255,0,0,0.6)",
  },
  video: {},
  file: {
    height: heightPercentage(25),
    width: "100%",
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  imageIcon: {
    borderRadius: theme.radius.md,
  },
  container: {
    flex: 1,
    marginBottom: 30,
    paddingHorizontal: widthPercentage(4),
    gap: 15,
  },
  title: {
    fontSize: heightPercentage(2.5),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  username: {
    fontSize: heightPercentage(2),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
  avatar: {
    height: heightPercentage(6.5),
    width: heightPercentage(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
  },
  publicText: {
    fontSize: heightPercentage(1.7),
    fontWeight: theme.fonts.medium,
    color: theme.colors.textLight,
  },
  textEditor: {},
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    padding: 12,
    paddingHorizontal: 18,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
  },
  mediaIcons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  addImageText: {
    fontSize: heightPercentage(1.9),
    fontWeight: theme.fonts.semiBold,
    color: theme.colors.text,
  },
});
