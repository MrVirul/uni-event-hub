import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { storage } from "../lib/storage";

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await storage.getItem("userToken");
    setIsLoggedIn(!!token);
  };

  const { width, height } = useWindowDimensions();

  // Responsive Scaling Logic
  const isSmallDevice = width < 380;
  const headlineSize = isSmallDevice ? "text-3xl" : "text-[44px]";
  const subheadlineSize = isSmallDevice ? "text-base" : "text-lg";
  const logoSize = isSmallDevice ? "w-8 h-8" : "w-10 h-10";
  const ctaHeight = isSmallDevice ? "h-14" : "h-16";

  return (
    <SafeAreaView
      className="flex-1 bg-background"
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar style="dark" />
      <View
        className="flex-1 px-8 justify-between"
        style={{
          paddingTop: height * 0.05,
          paddingBottom: height * 0.04,
        }}
      >
        {/* Section 1: Minimalist Brand Identity */}
        <Animated.View
          entering={FadeIn.delay(200).duration(1000)}
          className="flex-row items-center justify-between"
        >
          <View className="flex-row items-center">
            <View
              className={`${logoSize} rounded-xl items-center justify-center mr-3`}
            >
              <Image
                source={require("../assets/images/logo.png")}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
                transition={1000}
              />
            </View>
            <Text
              className={`text-primary font-bold ${isSmallDevice ? "text-lg" : "text-xl"} tracking-tight`}
            >
              SLIIT Events
            </Text>
          </View>
        </Animated.View>

        {/* Section 2: Hero Section */}
        <View className={`${isSmallDevice ? "mt-4" : "mt-8"}`}>
          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            className="relative"
          >
            <View
              className="w-full rounded-[32px] overflow-hidden shadow-2xl shadow-primary/20 bg-primary/10"
              style={{ aspectRatio: isSmallDevice ? 1.2 : 0.8 }}
            >
              <Image
                source={require("../assets/images/hero.jpg")}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={1000}
              />
            </View>
          </Animated.View>

          {/* Section 3: Headline */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(800)}
            className={`${isSmallDevice ? "mt-6" : "mt-10"}`}
          >
            <Text
              className={`text-primary font-black ${headlineSize} leading-tight tracking-tighter`}
            >
              The Full Circle of{"\n"}
              <Text className="text-accent">SLIIT</Text>
              <Text className="text-primary"> Life</Text>
            </Text>
          </Animated.View>
        </View>

        {/* Section 4: CTA */}
        <View className="mt-auto">
          <Animated.View
            entering={FadeInUp.delay(800).duration(800)}
            className="gap-y-4"
          >
            <Link href={isLoggedIn ? "/profile" : "/register"} asChild>
              <TouchableOpacity
                activeOpacity={0.9}
                className={`bg-accent ${ctaHeight} rounded-3xl flex-row items-center justify-center shadow-xl shadow-accent/40`}
              >
                <Text
                  className={`text-primary font-black ${isSmallDevice ? "text-lg" : "text-xl"} mr-2`}
                >
                  {isLoggedIn ? "Go to Profile" : "Get Started"}
                </Text>
                <Ionicons
                  name={isLoggedIn ? "person-outline" : "arrow-forward"}
                  size={isSmallDevice ? 18 : 20}
                  color="#1D264F"
                />
              </TouchableOpacity>
            </Link>

            {!isLoggedIn && (
              <Link href="/login" asChild>
                <TouchableOpacity
                  activeOpacity={0.7}
                  className="py-2 items-center justify-center"
                >
                  <Text className="text-primary/60 font-bold text-base text-center">
                    Already a member?{" "}
                    <Text className="text-primary font-black">Log In</Text>
                  </Text>
                </TouchableOpacity>
              </Link>
            )}
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}
