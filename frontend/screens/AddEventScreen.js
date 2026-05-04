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

const AddEventScreen = ({ navigation }) => {
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", category: "Academic", capacity: "", status: "Upcoming" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return Alert.alert("Permission needed");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [16, 9], quality: 0.8 });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date || !form.time || !form.location || !form.capacity)
      return Alert.alert("Error", "All fields are required");
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (image) formData.append("image", { uri: image.uri, type: "image/jpeg", name: "event.jpg" });
      await axios.post(`${API_URL}/api/events`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      Alert.alert("Success", "Event created!", [{ text: "OK", onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}><Text style={styles.headerTitle}>Create New Event</Text></View>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {image ? <Image source={{ uri: image.uri }} style={styles.previewImage} /> :
            <View style={styles.imagePlaceholder}><Text style={{ fontSize: 40 }}>📷</Text><Text style={styles.imageText}>Add Event Cover Photo</Text></View>}
        </TouchableOpacity>
        {[
          { label: "Event Title *", field: "title", placeholder: "e.g. Annual Sports Day" },
          { label: "Description *", field: "description", placeholder: "Describe the event...", multiline: true },
          { label: "Date * (YYYY-MM-DD)", field: "date", placeholder: "e.g. 2025-08-15" },
          { label: "Time *", field: "time", placeholder: "e.g. 10:00 AM" },
          { label: "Location *", field: "location", placeholder: "e.g. Main Auditorium" },
          { label: "Capacity *", field: "capacity", placeholder: "e.g. 200", keyboardType: "numeric" },
        ].map(({ label, field, multiline, ...rest }) => (
          <View key={field} style={styles.inputGroup}>
            <Text style={styles.label}>{label}</Text>
            <TextInput style={[styles.input, multiline && styles.textArea]} value={form[field]} onChangeText={(v) => setForm({ ...form, [field]: v })} multiline={multiline} numberOfLines={multiline ? 4 : 1} placeholderTextColor="#BDC3C7" {...rest} />
          </View>
        ))}
        <Text style={styles.label}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.value} style={[styles.chip, form.category === cat.value && styles.chipActive]} onPress={() => setForm({ ...form, category: cat.value })}>
              <Text style={[styles.chipText, form.category === cat.value && { color: "#fff" }]}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>🎉 Create Event</Text>}
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
  submitButton: { backgroundColor: "#1a237e", padding: 16, borderRadius: 12, alignItems: "center", marginBottom: 40 },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default AddEventScreen;
