import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, Image, Alert, ActivityIndicator
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

const CATEGORIES = [
  { label: "🎓 Academic", value: "Academic" },
  { label: "⚽ Sports", value: "Sports" },
  { label: "🎭 Cultural", value: "Cultural" },
  { label: "🎉 Social", value: "Social" },
  { label: "🔧 Workshop", value: "Workshop" },
  { label: "📌 Other", value: "Other" },
];

const STATUSES = [
  { label: "Upcoming", value: "Upcoming", color: "#4A90E2" },
  { label: "Ongoing", value: "Ongoing", color: "#E67E22" },
  { label: "Completed", value: "Completed", color: "#27AE60" },
  { label: "Cancelled", value: "Cancelled", color: "#E74C3C" },
];

const EditEventScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const [form, setForm] = useState({
    title: event.title, description: event.description,
    date: event.date?.split("T")[0] || "", time: event.time,
    location: event.location, category: event.category,
    capacity: String(event.capacity), status: event.status,
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission needed");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 0.8 });
    if (!result.canceled) setNewImage(result.assets[0]);
  };

  const handleUpdate = async () => {
    if (!form.title) return Alert.alert("Error", "Title is required");
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (newImage) formData.append("image", { uri: newImage.uri, type: "image/jpeg", name: "event.jpg" });
      await axios.put(`${API_URL}/api/events/${event._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Event updated!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const currentImage = newImage?.uri || (event.image ? `${API_URL}${event.image}` : null);

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}><Text style={styles.headerTitle}>Edit Event</Text></View>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {currentImage ? <Image source={{ uri: currentImage }} style={styles.previewImage} /> :
            <View style={styles.imagePlaceholder}><Text style={{ fontSize: 40 }}>📷</Text><Text style={styles.imageText}>Tap to change image</Text></View>}
        </TouchableOpacity>
        {[
          { label: "Event Title *", field: "title" },
          { label: "Description *", field: "description", multiline: true },
          { label: "Date (YYYY-MM-DD)", field: "date" },
          { label: "Time", field: "time" },
          { label: "Location", field: "location" },
          { label: "Capacity", field: "capacity", keyboardType: "numeric" },
        ].map(({ label, field, multiline, ...rest }) => (
          <View key={field} style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={[styles.input, multiline && styles.textArea]} value={form[field]} onChangeText={(v) => setForm({ ...form, [field]: v })} multiline={multiline} numberOfLines={multiline ? 4 : 1} placeholderTextColor="#BDC3C7" {...rest} />
          </View>
        ))}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.chip, form.category === cat.value && styles.chipActive]} onPress={() => setForm({ ...form, category: cat.value })}>
              <Text style={[styles.chipText, form.category === cat.value && { color: "#fff" }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.label}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {STATUSES.map((s) => (
            <TouchableOpacity key={s.value} style={[styles.chip, form.status === s.value && { backgroundColor: s.color, borderColor: s.color }]} onPress={() => setForm({ ...form, status: s.value })}>
              <Text style={[styles.chipText, form.status === s.value && { color: "#fff" }]}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>💾 Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  header: { backgroundColor: "#1a237e", padding: 20, paddingTop: 50 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  inner: { padding: 20 },
  imagePicker: { borderRadius: 16, overflow: "hidden", marginBottom: 20, borderWidth: 2, borderColor: "#4A90E2", borderStyle: "dashed" },
  imagePlaceholder: { height: 180, justifyContent: "center", alignItems: "center", backgroundColor: "#EBF3FB" },
  imageText: { color: "#4A90E2", fontWeight: "600", marginTop: 8 },
  previewImage: { width: "100%", height: 180, resizeMode: "cover" },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#1C1E21", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#DDE3EB", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#1C1E21" },
  textArea: { height: 100, textAlignVertical: "top" },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: "#4A90E2", marginRight: 8 },
  chipActive: { backgroundColor: "#4A90E2" },
  chipText: { color: "#4A90E2", fontWeight: "600" },
  saveButton: { backgroundColor: "#27AE60", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default EditEventScreen;
