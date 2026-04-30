import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

// Replace with your actual backend IP/domain
const API_URL = "http://localhost:3000/api/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Responsive Scaling
  const isSmallDevice = width < 380;
  const titleSize = isSmallDevice ? "text-3xl" : "text-5xl";
  const inputHeight = isSmallDevice ? "h-14" : "h-16";
  const labelSize = isSmallDevice ? "text-xs" : "text-sm";

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 204) {
        throw new Error("Server returned no content. Please contact support.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      console.log("Login successful:", data.user.username);

      Alert.alert("Success", "Welcome back!", [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
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
          className="px-8"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center py-10">
            {/* Header Section */}
            <View className={`items-center ${isSmallDevice ? "mb-10" : "mb-14"}`}>
              <View className={`${isSmallDevice ? "w-20 h-20" : "w-24 h-24"} mb-6`}>
                <Image
                  source={require("../assets/images/logo.png")}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="contain"
                  transition={1000}
                />
              </View>
              <Text className={`text-primary ${titleSize} font-black tracking-tighter text-center`}>
                SLIIT{"\n"}Events
              </Text>
            </View>

            {/* Error Message */}
            {error ? (
              <View className="bg-destructive/10 p-4 rounded-2xl mb-8 flex-row items-center border border-destructive/20">
                <Ionicons name="alert-circle" size={20} color="#ef4444" />
                <Text className="text-destructive font-medium ml-2 flex-1">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Form Section */}
            <View className="space-y-5">
              <View>
                <Text className={`text-primary font-bold mb-2 ml-1 ${labelSize} uppercase tracking-widest opacity-70`}>
                  Email Address
                </Text>
                <View className={`flex-row items-center bg-card border border-border rounded-2xl px-4 ${inputHeight} focus:border-accent`}>
                  <Ionicons name="mail-outline" size={20} color="#64748B" />
                  <TextInput
                    className="flex-1 ml-3 text-primary text-base"
                    placeholder="name@sliit.lk"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={(text) => {
                      setEmail(text);
                      if (error) setError("");
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>
              </View>

              <View className="mt-2">
                <Text className={`text-primary font-bold mb-2 ml-1 ${labelSize} uppercase tracking-widest opacity-70`}>
                  Password
                </Text>
                <View className={`flex-row items-center bg-card border border-border rounded-2xl px-4 ${inputHeight} focus:border-accent`}>
                  <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
                  <TextInput
                    className="flex-1 ml-3 text-primary text-base"
                    placeholder="••••••••"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      if (error) setError("");
                    }}
                    secureTextEntry={!showPassword}
                    editable={!isLoading}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons 
                      name={showPassword ? "eye-off-outline" : "eye-outline"} 
                      size={20} 
                      color="#64748B" 
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity className="items-end mt-1">
                <Text className="text-primary font-bold">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogin}
                disabled={isLoading}
                className={`${inputHeight} rounded-2xl items-center justify-center mt-10 shadow-xl ${
                  isLoading ? "bg-accent/70" : "bg-accent shadow-accent/30"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator color="#1D264F" />
                ) : (
                  <Text className={`text-primary ${isSmallDevice ? "text-lg" : "text-xl"} font-black uppercase tracking-tighter`}>Login</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View className={`flex-row justify-center ${isSmallDevice ? "mt-10" : "mt-12"}`}>
              <Text className="text-muted-foreground text-base">
                Don't have an account?{" "}
              </Text>
              <Link href="/register" asChild>
                <TouchableOpacity disabled={isLoading}>
                  <Text className="text-accent font-black text-base">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
