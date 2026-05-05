import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { API_URL } from "../../constants/Config";

import {
  Card,
} from "../../components/ui/Card";

const { width } = Dimensions.get("window");

export default function ClubDashboardScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [fetchingEvents, setFetchingEvents] = useState(true);

  useEffect(() => {
    fetchClubDetails();
    fetchClubEvents();
  }, [id]);

  const fetchClubDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clubs/${id}`);
      if (response.ok) {
        const data = await response.json();
        setClub(data.club);
      }
    } catch (error) {
      console.error("Error fetching club details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClubEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events?clubId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setFetchingEvents(false);
    }
  };

  const formatImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    return `${API_URL}${url}`;
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              const response = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });

              if (response.ok) {
                setEvents(prev => prev.filter(e => e._id !== eventId));
              } else {
                Alert.alert("Error", "Failed to delete event");
              }
            } catch (error) {
              Alert.alert("Error", "Something went wrong");
            }
          }
        }
      ]
    );
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
        <Text style={styles.headerTitle}>Club Dashboard</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Club Profile Info (Non-editable) */}
        <View style={styles.clubInfoCard}>
           <View style={styles.clubHeaderRow}>
            <View style={styles.avatarContainer}>
                {club?.image ? (
                <Image source={{ uri: formatImageUrl(club.image) || "" }} style={styles.clubAvatar} />
                ) : (
                <View style={[styles.clubAvatar, styles.placeholderAvatar]}>
                    <Ionicons name="people" size={32} color="#64748b" />
                </View>
                )}
            </View>
            <View style={styles.clubTextInfo}>
                <Text style={styles.clubName}>{club?.name}</Text>
                <Text style={styles.clubType}>Tech club</Text>
            </View>
           </View>
           <Text style={styles.clubDescription}>{club?.description}</Text>
        </View>

        {/* Posted Events Section */}
        <View style={styles.eventsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Posted Events</Text>
            <TouchableOpacity 
              style={styles.addEventButton}
              onPress={() => router.push("/events/add")}
            >
              <Ionicons name="add" size={18} color="#0f172a" />
              <Text style={styles.addEventText}>New Event</Text>
            </TouchableOpacity>
          </View>

          {fetchingEvents ? (
            <ActivityIndicator size="small" color="#0f172a" style={{ marginTop: 20 }} />
          ) : events.length === 0 ? (
            <View style={styles.emptyEvents}>
              <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
              <Text style={styles.emptyText}>No events posted yet.</Text>
            </View>
          ) : (
            events.map((event) => (
              <Card key={event._id} style={styles.eventCard}>
                <View style={styles.eventCardInner}>
                  {event.image && (
                    <Image 
                      source={{ uri: formatImageUrl(event.image) || "" }} 
                      style={styles.eventImage} 
                    />
                  )}
                  <View style={styles.eventInfo}>
                    <View style={styles.eventHeaderRow}>
                      <Text style={styles.eventTitle} numberOfLines={1}>{event.title}</Text>
                      <View style={styles.eventActionsRow}>
                        <TouchableOpacity 
                          onPress={() => router.push(`/events/registrations/${event._id}`)}
                          style={styles.actionIconButton}
                        >
                          <Ionicons name="people-outline" size={18} color="#3b82f6" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => router.push(`/events/edit/${event._id}`)}
                          style={styles.actionIconButton}
                        >
                          <Ionicons name="create-outline" size={18} color="#64748b" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => handleDeleteEvent(event._id)}
                          style={styles.actionIconButton}
                        >
                          <Ionicons name="trash-outline" size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.eventMeta}>
                      <Ionicons name="calendar-outline" size={14} color="#64748b" />
                      <Text style={styles.eventMetaText}>
                        {new Date(event.date).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.eventMeta}>
                      <Ionicons name="location-outline" size={14} color="#64748b" />
                      <Text style={styles.eventMetaText} numberOfLines={1}>
                        {event.location}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
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
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  clubInfoCard: {
    padding: 20,
    backgroundColor: "#ffffff",
    margin: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  clubHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  clubAvatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  placeholderAvatar: {
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  clubTextInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  clubType: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  clubDescription: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
  },
  eventsSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0f172a",
  },
  addEventButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  addEventText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0f172a",
  },
  emptyEvents: {
    padding: 60,
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderStyle: "dashed",
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
  eventCard: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  eventCardInner: {
    padding: 12,
    flexDirection: "row",
    gap: 12,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
  },
  eventInfo: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  eventHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  eventActionsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionIconButton: {
    padding: 4,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0f172a",
  },
  eventMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventMetaText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
  },
});
