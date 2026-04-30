import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";

const API_URL = "http://localhost:3000/api/auth/register";

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentNumber: "",
    phoneNumber: "",
    password: "",
  });
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleRegister = async () => {
    const { name, email, studentNumber, phoneNumber, password } = form;

    if (!name || !email || !studentNumber || !phoneNumber || !password) {
      Alert.alert(
        "Required Fields",
        "Please fill in all the details to continue.",
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("studentNumber", studentNumber);
      formData.append("phoneNumber", phoneNumber);
      formData.append("password", password);

      if (image) {
        const uriParts = image.split(".");
        const fileType = uriParts[uriParts.length - 1];
        // @ts-ignore
        formData.append("profileImage", {
          uri: Platform.OS === "android" ? image : image.replace("file://", ""),
          name: `profile.${fileType}`,
          type: `image/${fileType}`,
        });
      }

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Welcome!", "Your account has been created successfully.", [
          { text: "Let's Go", onPress: () => router.replace("/login") },
        ]);
      } else {
        Alert.alert(
          "Registration Failed",
          data.message || "Please check your details and try again.",
        );
      }
    } catch (error) {
      Alert.alert(
        "Network Error",
        "Could not connect to the server. Please check your internet.",
      );
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 pt-6 pb-12"
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Animated.View entering={FadeInDown.duration(600)}>
            <Button
              variant="outline"
              size="icon"
              onPress={() => router.back()}
              className="w-12 h-12"
            >
              <Ionicons name="chevron-back" size={24} color="#1D264F" />
            </Button>
          </Animated.View>

          <Card className="mt-8">
            <CardHeader className="items-center">
              <Animated.View entering={FadeInDown.delay(200).duration(600)}>
                <TouchableOpacity
                  onPress={pickImage}
                  activeOpacity={0.8}
                  className="w-24 h-24 rounded-[32px] bg-primary/5 items-center justify-center border-2 border-dashed border-primary/10 overflow-hidden"
                >
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <View className="items-center">
                      <Ionicons
                        name="camera-outline"
                        size={32}
                        color="#1D264F"
                        style={{ opacity: 0.6 }}
                      />
                      <Label className="mt-1 text-[8px]">Add Photo</Label>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
              <CardTitle className="mt-4">Create Account</CardTitle>
              <CardDescription>Join the SLIIT event community</CardDescription>
            </CardHeader>

            <CardContent className="gap-y-5">
              <View>
                <Label>Full Name</Label>
                <Input
                  leftIcon={
                    <Ionicons name="person-outline" size={18} color="#1D264F" />
                  }
                  placeholder="e.g. Virul Meemana"
                  value={form.name}
                  onChangeText={(text) => setForm({ ...form, name: text })}
                />
              </View>

              <View>
                <Label>University Email</Label>
                <Input
                  leftIcon={
                    <Ionicons name="mail-outline" size={18} color="#1D264F" />
                  }
                  placeholder="e.g. it21XXXX@my.sliit.lk"
                  keyboardType="email-address"
                  value={form.email}
                  onChangeText={(text) => setForm({ ...form, email: text })}
                />
              </View>

              <View>
                <Label>Student IT Number</Label>
                <Input
                  leftIcon={
                    <Ionicons name="card-outline" size={18} color="#1D264F" />
                  }
                  placeholder="IT2100XXXX"
                  value={form.studentNumber}
                  onChangeText={(text) =>
                    setForm({ ...form, studentNumber: text })
                  }
                />
              </View>

              <View>
                <Label>Phone Number</Label>
                <Input
                  leftIcon={
                    <Ionicons name="call-outline" size={18} color="#1D264F" />
                  }
                  placeholder="+94 XX XXX XXXX"
                  keyboardType="phone-pad"
                  value={form.phoneNumber}
                  onChangeText={(text) =>
                    setForm({ ...form, phoneNumber: text })
                  }
                />
              </View>

              <View>
                <Label>Password</Label>
                <Input
                  leftIcon={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color="#1D264F"
                    />
                  }
                  placeholder="••••••••"
                  secureTextEntry
                  value={form.password}
                  onChangeText={(text) => setForm({ ...form, password: text })}
                />
              </View>

              <Button
                onPress={handleRegister}
                loading={loading}
                className="mt-4"
                label="Create Account"
              />
            </CardContent>
          </Card>

          <Animated.View
            entering={FadeInUp.delay(800).duration(600)}
            className="mt-8 items-center flex-row justify-center"
          >
            <CardDescription className="font-bold">
              Already have an account?{" "}
            </CardDescription>
            <TouchableOpacity onPress={() => router.replace("/login")}>
              <Text className="text-primary font-black underline">Log In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
