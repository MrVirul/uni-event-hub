import React, { useEffect, useState } from "react";
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";

const EventDetailScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetchEvent();
    loadUser();
  }, []);

  const loadUser = async () => {
    const user = await AsyncStorage.getItem("user");
    if (user) setCurrentUserId(JSON.parse(user)._id);
  };

  const fetchEvent = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/events/${eventId}`);
      setEvent(res.data.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load event");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Event", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`${API_URL}/api/events/${eventId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert("Success", "Event deleted");
            navigation.goBack();
          } catch (error) {
            Alert.alert("Error", "Failed to delete event");
          }
        },
      },
    ]);
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#4A90E2" /></View>;

  const isOwner = currentUserId && event?.createdBy?._id === currentUserId;

  return (
    <ScrollView style={styles.container}>
      {event.image ? (
        <Image source={{ uri: `${API_URL}${event.image}` }} style={styles.heroImage} />
      ) : (
        <View style={styles.placeholderHero}><Text style={{ fontSize: 60 }}>🎓</Text></View>
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.category}>{event.category}</Text>
        <View style={styles.infoBox}>
          {[
            { icon: "📆", label: "Date", value: new Date(event.date).toDateString() },
            { icon: "🕐", label: "Time", value: event.time },
            { icon: "📍", label: "Location", value: event.location },
            { icon: "👥", label: "Capacity", value: `${event.registeredCount}/${event.capacity}` },
            { icon: "👤", label: "Organizer", value: event.createdBy?.name || "Unknown" },
          ].map(({ icon, label, value }) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoIcon}>{icon}</Text>
              <View>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.sectionTitle}>About This Event</Text>
        <Text style={styles.description}>{event.description}</Text>
        {isOwner && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate("EditEvent", { event })}>
              <Text style={styles.editButtonText}>✏️ Edit Event</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F0F2F5" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  heroImage: { width: "100%", height: 280, resizeMode: "cover" },
  placeholderHero: { width: "100%", height: 200, backgroundColor: "#EBF3FB", justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1C1E21", marginBottom: 6 },
  category: { fontSize: 14, color: "#4A90E2", fontWeight: "600", marginBottom: 16 },
  infoBox: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20, elevation: 3 },
  infoRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  infoIcon: { fontSize: 20, marginRight: 12 },
  infoLabel: { fontSize: 11, color: "#65676B", textTransform: "uppercase" },
  infoValue: { fontSize: 15, color: "#1C1E21", fontWeight: "500" },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#1C1E21", marginBottom: 8 },
  description: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 24 },
  actionRow: { flexDirection: "row", gap: 12 },
  editButton: { flex: 1, backgroundColor: "#4A90E2", padding: 14, borderRadius: 10, alignItems: "center" },
  editButtonText: { color: "#fff", fontWeight: "700" },
  deleteButton: { flex: 1, backgroundColor: "#FDEDEC", padding: 14, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#E74C3C" },
  deleteButtonText: { color: "#E74C3C", fontWeight: "700" },
});

export default EventDetailScreen;
