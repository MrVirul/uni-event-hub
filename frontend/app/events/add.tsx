import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../constants/Config";

// Shadcn UI Components
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

const CATEGORIES = [
  { label: "Academic", value: "Academic", icon: "school-outline" },
  { label: "Sports", value: "Sports", icon: "football-outline" },
  { label: "Cultural", value: "Cultural", icon: "color-palette-outline" },
  { label: "Social", value: "Social", icon: "people-outline" },
  { label: "Workshop", value: "Workshop", icon: "construct-outline" },
  { label: "Other", value: "Other", icon: "ellipsis-horizontal-outline" },
];

export default function AddEventScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<any>(null);
  const [myClubs, setMyClubs] = useState<any[]>([]);
  const [fetchingClubs, setFetchingClubs] = useState(true);

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "Academic",
    capacity: "",
    clubId: "",
  });

  useEffect(() => {
    fetchMyClubs();
  }, []);

  const fetchMyClubs = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/clubs/my/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setMyClubs(data.clubs);
        if (data.clubs.length > 0) {
          setForm((prev) => ({ ...prev, clubId: data.clubs[0]._id }));
        }
      }
    } catch (error) {
      console.error("Error fetching clubs:", error);
    } finally {
      setFetchingClubs(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos to upload an event image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date || !form.time || !form.location || !form.clubId) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("date", form.date);
      formData.append("time", form.time);
      formData.append("location", form.location);
      formData.append("category", form.category);
      formData.append("capacity", form.capacity);
      formData.append("clubId", form.clubId);

      if (image) {
        const uriParts = image.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: image.uri,
          name: `event_image.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const response = await fetch(`${API_URL}/api/events`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Event posted successfully!", [
          { text: "OK", onPress: () => router.replace("/home") },
        ]);
      } else {
        throw new Error(data.message || "Failed to post event");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingClubs) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0f172a" />
      </View>
    );
  }

  if (myClubs.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#64748b" />
          <Text style={styles.errorTitle}>No Clubs Found</Text>
          <Text style={styles.errorText}>You must own a club to post events.</Text>
          <Button onPress={() => router.back()}>Go Back</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Event</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        >
          <Card style={styles.mainCard}>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                Fill in the information below to announce your club's next big event.
              </CardDescription>
            </CardHeader>

            <CardContent style={styles.formSection}>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="cloud-upload-outline" size={40} color="#94a3b8" />
                    <Text style={styles.imagePlaceholderText}>Upload Cover Image</Text>
                  </View>
                )}
                <View style={styles.editImageIcon}>
                  <Ionicons name="camera" size={18} color="#ffffff" />
                </View>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Label>Event Title</Label>
                <Input
                  placeholder="e.g. Hackathon 2025"
                  value={form.title}
                  onChangeText={(text) => setForm({ ...form, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Label>Description</Label>
                <Input
                  placeholder="What's happening?"
                  multiline
                  numberOfLines={4}
                  style={styles.textArea}
                  value={form.description}
                  onChangeText={(text) => setForm({ ...form, description: text })}
                />
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Label>Date</Label>
                  <Input
                    placeholder="YYYY-MM-DD"
                    value={form.date}
                    onChangeText={(text) => setForm({ ...form, date: text })}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Label>Time</Label>
                  <Input
                    placeholder="10:00 AM"
                    value={form.time}
                    onChangeText={(text) => setForm({ ...form, time: text })}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Label>Location</Label>
                <Input
                  placeholder="Building 5, Room 201"
                  value={form.location}
                  onChangeText={(text) => setForm({ ...form, location: text })}
                />
              </View>

              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Label>Capacity</Label>
                  <Input
                    placeholder="Unlimited"
                    keyboardType="numeric"
                    value={form.capacity}
                    onChangeText={(text) => setForm({ ...form, capacity: text })}
                  />
                </View>
              </View>

              <Label style={{ marginTop: 10 }}>Category</Label>
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[
                      styles.categoryChip,
                      form.category === cat.value && styles.activeCategoryChip,
                    ]}
                    onPress={() => setForm({ ...form, category: cat.value })}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={14}
                      color={form.category === cat.value ? "#ffffff" : "#64748b"}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        form.category === cat.value && styles.activeCategoryText,
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Label style={{ marginTop: 20 }}>Post as Club</Label>
              <View style={styles.clubSelector}>
                {myClubs.map((club) => (
                  <TouchableOpacity
                    key={club._id}
                    style={[
                      styles.clubOption,
                      form.clubId === club._id && styles.activeClubOption,
                    ]}
                    onPress={() => setForm({ ...form, clubId: club._id })}
                  >
                    <Image source={{ uri: club.image }} style={styles.clubIcon} />
                    <Text
                      style={[
                        styles.clubName,
                        form.clubId === club._id && styles.activeClubName,
                      ]}
                      numberOfLines={1}
                    >
                      {club.name}
                    </Text>
                    {form.clubId === club._id && (
                      <Ionicons name="checkmark-circle" size={20} color="#0f172a" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </CardContent>

            <CardFooter style={styles.cardFooter}>
              <Button
                variant="outline"
                onPress={() => router.back()}
                style={{ flex: 1, marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                onPress={handleSubmit}
                loading={loading}
                style={{ flex: 2 }}
              >
                Publish Event
              </Button>
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
    backgroundColor: "#f8fafc", // slate-50
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  iconButton: {
    padding: 8,
  },
  container: {
    flex: 1,
  },
  mainCard: {
    width: "100%",
  },
  imagePicker: {
    height: 180,
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    alignItems: "center",
    gap: 8,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: "#94a3b8",
    fontWeight: "600",
  },
  editImageIcon: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "#0f172a",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  formSection: {
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 12,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    gap: 6,
  },
  activeCategoryChip: {
    backgroundColor: "#0f172a",
    borderColor: "#0f172a",
  },
  categoryText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
  activeCategoryText: {
    color: "#ffffff",
  },
  clubSelector: {
    gap: 8,
    marginTop: 8,
  },
  clubOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
    gap: 12,
  },
  activeClubOption: {
    borderColor: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  clubIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  clubName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#475569",
    flex: 1,
  },
  activeClubName: {
    color: "#0f172a",
    fontWeight: "600",
  },
  cardFooter: {
    gap: 0, // Handled by inner margins
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },
});
