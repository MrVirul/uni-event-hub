import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../constants/Config";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";

export default function SignupScreen() {
  const router = useRouter();

  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      router.replace("/home");
    }
  };

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    studentNumber: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);


  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    const { name, email, studentNumber, phoneNumber, password } = formData;

    // Basic validation
    if (!name || !email || !studentNumber || !phoneNumber || !password) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }

    setLoading(true);


    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong during registration",
        );
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      Alert.alert("Success", "Account created successfully!", [
        { text: "OK", onPress: () => router.replace("/home") },
      ]);
    } catch (error: any) {
      if (error.name === "AbortError") {
        Alert.alert(
          "Network Error",
          "The request timed out. Please check your internet connection and ensure the server is running.",
        );
      } else {
        Alert.alert("Registration Failed", error.message || "An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Card style={styles.card}>
            <CardHeader style={styles.cardHeader}>
              <View style={styles.logoBadge}>
                <Image
                  source={require("../assets/images/icon.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>
                Enter your information below to sign up
              </CardDescription>
            </CardHeader>

            <CardContent style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={formData.name}
                  onChangeText={(text) => handleChange("name", text)}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Email</Label>
                <Input
                  placeholder="m@example.com"
                  value={formData.email}
                  onChangeText={(text) => handleChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Student Number</Label>
                <Input
                  placeholder="12345678"
                  value={formData.studentNumber}
                  onChangeText={(text) => handleChange("studentNumber", text)}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Phone Number</Label>
                <Input
                  placeholder="+1234567890"
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleChange("phoneNumber", text)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Password</Label>
                <Input
                  placeholder="••••••••"
                  value={formData.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry
                />
              </View>

              <Button
                style={styles.submitButton}
                onPress={handleSignup}
                loading={loading}
              >
                Sign Up
              </Button>
            </CardContent>

            <CardFooter style={styles.cardFooter}>
              <Text style={styles.footerText}>
                Already have an account?{" "}
                <Text
                  style={styles.loginLink}
                  onPress={() => router.push("/login")}
                >
                  Sign in
                </Text>
              </Text>
            </CardFooter>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa", // zinc-50
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  cardHeader: {
    alignItems: "center",
    textAlign: "center",
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  cardContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 2,
  },
  submitButton: {
    marginTop: 8,
  },
  cardFooter: {
    justifyContent: "center",
  },
  footerText: {
    color: "#71717a", // zinc-500
    fontSize: 14,
  },
  loginLink: {
    color: "#09090b", // zinc-950
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
