import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../../constants/Config";

export default function EventRegistrationsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    fetchEventDetails();
    fetchRegistrations();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events/${id}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data.data);
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/bookings/event/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRegistrations(data.bookings);
      } else {
        Alert.alert("Error", "Failed to fetch registrations");
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttended = async (bookingId: string) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "Attended" }),
      });

      if (response.ok) {
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg._id === bookingId ? { ...reg, status: "Attended" } : reg
          )
        );
        Alert.alert("Success", "Student marked as attended");
      } else {
        Alert.alert("Error", "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.registrationCard}>
      <View style={styles.cardMainContent}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {item.userId?.name?.charAt(0).toUpperCase() || "?"}
            </Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.studentName}>
              {item.userId?.name || "Unknown Student"}
            </Text>
            <Text style={styles.studentId}>
              {item.userId?.studentNumber || "No ID"}
            </Text>
            <Text style={styles.studentEmail}>
              {item.userId?.email || "No Email"}
            </Text>
          </View>
        </View>
        <View style={styles.bookingDetails}>
          <View
            style={[
              styles.badge,
              item.status === "Attended" && styles.attendedBadge,
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                item.status === "Attended" && styles.attendedBadgeText,
              ]}
            >
              {item.status}
            </Text>
          </View>
          {item.contactNumber && (
            <View style={styles.contactRow}>
              <Ionicons name="call-outline" size={12} color="#64748b" />
              <Text style={styles.contactText}>{item.contactNumber}</Text>
            </View>
          )}
        </View>
      </View>

      {item.status === "Pending" && (
        <TouchableOpacity
          style={styles.markAttendedBtn}
          onPress={() => handleMarkAttended(item._id)}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
          <Text style={styles.markAttendedText}>Mark Attended</Text>
        </TouchableOpacity>
      )}
    </View>
  );

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
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Registered Students</Text>
          {event && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {event.title}
            </Text>
          )}
        </View>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={registrations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No students registered yet.</Text>
          </View>
        }
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  backButton: {
    padding: 8,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  registrationCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardMainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3b82f6",
  },
  textContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  studentId: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 1,
  },
  studentEmail: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 1,
  },
  bookingDetails: {
    alignItems: "flex-end",
    gap: 6,
  },
  badge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  attendedBadge: {
    backgroundColor: "#ecfdf5",
  },
  attendedBadgeText: {
    color: "#059669",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  contactText: {
    fontSize: 12,
    color: "#64748b",
  },
  markAttendedBtn: {
    backgroundColor: "#10b981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    gap: 6,
  },
  markAttendedText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
