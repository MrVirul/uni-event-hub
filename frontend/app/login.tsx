import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Text,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { storage } from "../lib/storage";

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

const API_URL = "http://localhost:3000/api/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Info", "Please enter your email and password.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      // Save token and user info
      await storage.setItem('userToken', data.token);
      await storage.setItem('userData', JSON.stringify(data.user));

      Alert.alert("Success", `Welcome back, ${data.user.name}!`, [
        { text: "Continue", onPress: () => router.replace("/profile") },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Login Error",
        err.message || "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
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
          className="px-6"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center py-12">
            <Animated.View
              entering={FadeInDown.duration(800)}
              className="items-center mb-8"
            >
              <View className="w-20 h-20 mb-6 rounded-2xl overflow-hidden shadow-sm">
                <Image
                  source={require("../assets/images/logo.png")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                />
              </View>
              <Text className="text-primary text-4xl font-black tracking-tighter text-center">
                SLIIT Events
              </Text>
            </Animated.View>

            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
              </CardHeader>

              <CardContent className="gap-y-4">
                <View>
                  <Label>Email Address</Label>
                  <Input
                    leftIcon={
                      <Ionicons name="mail-outline" size={18} color="#1D264F" />
                    }
                    placeholder="it21XXXX@my.sliit.lk"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
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
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color="#64748B"
                        />
                      </TouchableOpacity>
                    }
                  />
                  <TouchableOpacity className="items-end mt-3">
                    <Text className="text-primary font-bold text-xs underline">
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>

                <Button
                  onPress={handleLogin}
                  loading={isLoading}
                  className="mt-4"
                  label="Login"
                />
              </CardContent>
            </Card>

            <Animated.View
              entering={FadeInUp.delay(800).duration(800)}
              className="flex-row justify-center mt-8 items-center"
            >
              <CardDescription className="font-bold">
                Don't have an account?{" "}
              </CardDescription>
              <Link href="/register" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text className="text-primary font-black underline">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
