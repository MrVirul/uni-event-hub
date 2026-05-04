import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Sidebar } from "../components/ui/Sidebar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { API_URL } from "../constants/Config";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getUserData();
    fetchEvents();
  }, []);

  const getUserData = async () => {
    const userJson = await AsyncStorage.getItem("user");
    if (userJson) {
      const user = JSON.parse(userJson);
      setUserName(user.name);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/api/events`);
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const formatImageUrl = (url: string) => {
    if (!url) return null;
    if (url.startsWith("http") || url.startsWith("data:image")) return url;
    return `${API_URL}${url}`;
  };

  const renderEventItem = ({ item }: { item: any }) => {
    const eventImage = formatImageUrl(item.image);
    const clubImage = formatImageUrl(item.club?.image);

    return (
      <View style={styles.eventCard}>
        <View style={styles.eventCardHeader}>
          <View style={styles.clubInfo}>
            {clubImage ? (
              <Image source={{ uri: clubImage }} style={styles.clubAvatar} />
            ) : (
              <View
                style={[
                  styles.clubAvatar,
                  {
                    backgroundColor: "#f4f4f5",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Ionicons name="people" size={16} color="#71717a" />
              </View>
            )}
            <View>
              <Text style={styles.clubName}>
                {item.club?.name || "Independent"}
              </Text>
              <Text style={styles.eventTimeAgo}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventDescription} numberOfLines={3}>
            {item.description}
          </Text>
        </View>

        {eventImage && (
          <Image source={{ uri: eventImage }} style={styles.eventImage} />
        )}

        <View style={styles.eventDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color="#71717a" />
            <Text style={styles.detailText}>
              {new Date(item.date).toLocaleDateString()} at {item.time}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#71717a" />
            <Text style={styles.detailText}>{item.location}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />

      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../assets/images/icon.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Uni Event Hub</Text>
        </View>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Ionicons name="menu" size={28} color="#09090b" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#09090b" />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.feedContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeText}>
                Hello, {userName || "User"}!
              </Text>
              <Text style={styles.subtitleText}>
                Discover what's happening on campus
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#a1a1aa" />
              <Text style={styles.emptyStateText}>No events found.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f5", // Light gray background for the feed
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#09090b",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  feedContainer: {
    paddingBottom: 20,
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#09090b",
  },
  subtitleText: {
    fontSize: 14,
    color: "#71717a",
    marginTop: 4,
  },
  eventCard: {
    backgroundColor: "#ffffff",
    marginBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e4e4e7",
  },
  eventCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
  },
  clubInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clubAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  clubName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#09090b",
  },
  eventTimeAgo: {
    fontSize: 12,
    color: "#71717a",
  },
  eventContent: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#09090b",
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 15,
    color: "#3f3f46",
    lineHeight: 20,
  },
  eventImage: {
    width: width,
    height: width * 0.5625, // 16:9 aspect ratio
    backgroundColor: "#f4f4f5",
  },
  eventDetails: {
    padding: 12,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#71717a",
    fontWeight: "500",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#a1a1aa",
    fontWeight: "500",
  },
});
