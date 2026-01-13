import Icon from "@/assets/icons";
import Button from "@/components/common/Button";
import Header from "@/components/common/Header";
import Input from "@/components/common/Input";
import ScreenWrapper from "@/components/common/ScreenWrapper";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/auth-context";
import { heightPercentage, widthPercentage } from "@/helpers/common";
import { getUserImageUrl, uploadFile } from "@/services/image-services";
import { updateUserData } from "@/services/user-services";
import { Profile } from "@/types";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const editProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const [user, setUser] = useState<Partial<Profile>>({
    name: "",
    phoneNumber: "",
    image: null as string | null,
    bio: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const [localImage, setLocalImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);

  const onSubmit = async () => {
    let userData: Partial<Profile> = { ...user };
    let { name, phoneNumber, address } = userData;

    if (!name || !phoneNumber || !address) {
      Alert.alert("Profile", "Please fill all the required fields.");
      return;
    }

    setLoading(true);

    if (localImage) {
      // upload image
      let imageResponse = await uploadFile(
        "profiles",
        localImage.uri,
        true,
        localImage.fileName || "profile.jpg"
      );

      if (imageResponse.success) {
        userData.image = imageResponse.data as string;
      }
    }

    // update user
    const response = await updateUserData(currentUser?.id!, userData);
    setLoading(false);

    if (response.success) {
      setUserData({ ...currentUser, ...response.data });
      Alert.alert("Profile", "Profile updated successfully.");
    } else {
      Alert.alert("Profile", response.msg || "Failed to update profile.");
    }
  };

  const onPickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setLocalImage(result.assets[0]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || "",
        phoneNumber: currentUser.phoneNumber || "",
        image: currentUser.image || null,
        bio: currentUser.bio || "",
        address: currentUser.address || "",
      });
    }
  }, [currentUser]);

  const imageSource = localImage
    ? { uri: localImage.uri }
    : getUserImageUrl(user?.image);

  return (
    <ScreenWrapper bg="#ffffff">
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <Header title="Edit Provider" showBackButton />

          {/* form */}
          <View style={styles.form}>
            <View style={styles.avatarContainer}>
              <Image source={imageSource} style={styles.avatar} />
              <Pressable style={styles.cameraIcon} onPress={onPickImage}>
                <Icon name="camera" size={20} strokeWidth={2.5} />
              </Pressable>
            </View>

            <Text
              style={{
                fontSize: heightPercentage(1.5),
                color: theme.colors.text,
              }}
            >
              Please fill your profile details
            </Text>
            <Input
              icon={<Icon name="user" size={20} strokeWidth={2.5} />}
              placeholder="Enter your name"
              value={user.name}
              onChangeText={(value: string) =>
                setUser({ ...user, name: value })
              }
            />
            <Input
              icon={<Icon name="call" size={20} strokeWidth={2.5} />}
              placeholder="Enter your phone number"
              value={user.phoneNumber}
              onChangeText={(value: string) =>
                setUser({ ...user, phoneNumber: value })
              }
            />
            <Input
              icon={<Icon name="location" size={20} strokeWidth={2.5} />}
              placeholder="Enter your address"
              value={user.address}
              onChangeText={(value: string) =>
                setUser({ ...user, address: value })
              }
            />
            <Input
              placeholder="Enter your bio"
              value={user.bio}
              onChangeText={(value: string) => setUser({ ...user, bio: value })}
              multiline={true}
              containerStyle={styles.bio}
            />

            <Button title="Update" onPress={onSubmit} loading={loading} />
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercentage(4),
  },

  avatarContainer: {
    height: heightPercentage(14),
    width: heightPercentage(14),
    alignSelf: "center",
  },

  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: theme.radius.xxl * 1.8,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: theme.colors.darkLight,
  },

  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: -10,
    padding: 8,
    borderRadius: 50,
    backgroundColor: "white",
    shadowColor: theme.colors.textLight,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 7,
  },
  form: {
    gap: 18,
    marginTop: 20,
  },
  input: {
    flexDirection: "row",
    borderWidth: 0.4,
    borderColor: theme.colors.text,
    borderRadius: theme.radius.xxl,
    borderCurve: "continuous",
    padding: 17,
    paddingHorizontal: 20,
    gap: 15,
  },
  bio: {
    flexDirection: "row",
    height: heightPercentage(15),
    alignItems: "flex-start",
    paddingVertical: 15,
  },
});
