import React from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top", "bottom"]}>
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }} 
        className="px-8 pt-12 pb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center">
          <View className="w-16 h-16 bg-accent rounded-2xl items-center justify-center shadow-lg shadow-accent/20 mb-6">
            <Ionicons name="person-add" size={32} color="#1D264F" />
          </View>
          
          <Text className="text-primary text-3xl font-bold tracking-tight text-center">
            Join UniEventHub
          </Text>
          <Text className="text-muted-foreground text-base mt-2 text-center mb-8">
            The registration system is being finalized for SLIIT students.
          </Text>

          <View className="bg-primary/5 p-6 rounded-3xl w-full border border-primary/5">
            <View className="flex-row items-center mb-4">
              <Ionicons name="information-circle" size={24} color="#1D264F" />
              <Text className="text-primary font-bold ml-2 text-lg">Coming Soon</Text>
            </View>
            <Text className="text-muted-foreground leading-6">
              We are currently integrating with the SLIIT student portal to provide a seamless experience. Stay tuned!
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-10 bg-primary h-14 w-full rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-lg font-bold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
