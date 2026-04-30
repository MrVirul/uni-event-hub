import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { storage } from "../lib/storage";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Label } from "../components/ui/Label";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await storage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await storage.removeItem("userToken");
          await storage.removeItem("userData");
          router.replace("/login");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color="#1D264F" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView 
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.duration(600)}
          className="flex-row items-center justify-between mt-6"
        >
          <TouchableOpacity
            onPress={() => router.replace("/")}
            className="w-10 h-10 items-center justify-center rounded-xl bg-white border border-primary/5 shadow-sm"
          >
            <Ionicons name="home-outline" size={20} color="#1D264F" />
          </TouchableOpacity>
          <Text className="text-primary font-black text-xl">My Profile</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="w-10 h-10 items-center justify-center rounded-xl bg-destructive/10"
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </Animated.View>

        {/* Profile Card */}
        <View className="mt-8">
          <Animated.View entering={FadeInDown.delay(200).duration(800)}>
            <Card className="items-center py-8">
              <View className="w-28 h-28 rounded-[40px] border-4 border-accent/20 p-1">
                <Image
                  source={{ uri: user?.profileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}` }}
                  className="w-full h-full rounded-[36px]"
                  contentFit="cover"
                />
              </View>
              <CardHeader className="items-center pb-2">
                <CardTitle className="text-3xl">{user?.name}</CardTitle>
                <CardDescription className="text-accent font-black uppercase tracking-widest text-[10px]">
                  {user?.role || "Student"}
                </CardDescription>
              </CardHeader>
            </Card>
          </Animated.View>

          {/* Details Section */}
          <Animated.View 
            entering={FadeInUp.delay(400).duration(800)}
            className="mt-6 gap-y-4"
          >
            <DetailItem 
              label="Email Address" 
              value={user?.email} 
              icon="mail-outline" 
            />
            <DetailItem 
              label="Student Number" 
              value={user?.studentNumber} 
              icon="card-outline" 
            />
            <DetailItem 
              label="Phone Number" 
              value={user?.phoneNumber} 
              icon="call-outline" 
            />
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View 
            entering={FadeInUp.delay(600).duration(800)}
            className="mt-10"
          >
            <Button 
              label="Edit Profile" 
              variant="outline"
              className="border-primary/10 h-14"
            />
            <Button 
              label="My Registered Events" 
              className="mt-4 h-14"
            />
          </Animated.View>
        </View>

        <View className="h-12" />
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailItem({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <View className="bg-white p-5 rounded-[24px] border border-primary/5 flex-row items-center">
      <View className="w-12 h-12 rounded-2xl bg-primary/5 items-center justify-center mr-4">
        <Ionicons name={icon} size={22} color="#1D264F" />
      </View>
      <View className="flex-1">
        <Label className="mb-0.5 opacity-40">{label}</Label>
        <Text className="text-primary font-bold text-base">{value || "Not provided"}</Text>
      </View>
    </View>
  );
}
