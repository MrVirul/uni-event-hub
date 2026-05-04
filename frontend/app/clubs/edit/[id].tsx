import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../../constants/Config";

import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Label } from "../../../components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";

export default function EditClubScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    fetchClubDetails();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clubs/${id}`);
      if (!response.ok) throw new Error("Failed to fetch club details");

      const data = await response.json();
      setFormData({
        name: data.club.name,
        description: data.club.description,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.description) {
      Alert.alert("Error", "Name and description are required");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/clubs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update club");

      Alert.alert("Success", "Club updated successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0f172a" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Club</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Club Settings</CardTitle>
              <CardDescription>Update your club's identity</CardDescription>
            </CardHeader>

            <CardContent style={styles.cardContent}>
              <View style={styles.inputGroup}>
                <Label>Club Name</Label>
                <Input
                  placeholder="Enter club name"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Description</Label>
                <Input
                  placeholder="What is this club about?"
                  value={formData.description}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, description: text }))
                  }
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                />
              </View>

              <Button
                style={styles.submitButton}
                onPress={handleUpdate}
                loading={saving}
              >
                Save Changes
              </Button>

              <Button
                variant="ghost"
                textStyle={{ color: "#ef4444" }}
                onPress={() => router.back()}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    width: "100%",
  },
  cardContent: {
    gap: 16,
  },
  inputGroup: {
    gap: 4,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  submitButton: {
    marginTop: 8,
  },
});
