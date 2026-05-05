import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  StatusBar,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { API_URL } from "../../constants/Config";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export function Sidebar({ visible, onClose }: SidebarProps) {
  const router = useRouter();
  const [isClubOwner, setIsClubOwner] = useState(false);

  useEffect(() => {
    if (visible) {
      checkClubOwnership();
    }
  }, [visible]);

  const checkClubOwnership = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`${API_URL}/api/clubs/my/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setIsClubOwner(data.clubs && data.clubs.length > 0);
      }
    } catch (error) {
      console.error("Error checking club ownership:", error);
    }
  };

  const handleNavigation = (path: string) => {
    onClose();
    router.push(path as any);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    onClose();
    router.replace("/");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sidebarContainer}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/images/icon.png")}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <Text style={styles.logoText}>Uni Event Hub</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#09090b" />
              </TouchableOpacity>
            </View>

            <View style={styles.navSection}>
              <TouchableOpacity
                style={styles.navItem}
                onPress={() => handleNavigation("/home")}
              >
                <Ionicons name="home-outline" size={20} color="#71717a" />
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => handleNavigation("/profile")}
              >
                <Ionicons name="person-outline" size={20} color="#71717a" />
                <Text style={styles.navText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => handleNavigation("/clubs/my")}
              >
                <Ionicons name="people-outline" size={20} color="#71717a" />
                <Text style={styles.navText}>My Clubs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.navItem}
                onPress={() => handleNavigation("/my-bookings")}
              >
                <Ionicons name="calendar-outline" size={20} color="#71717a" />
                <Text style={styles.navText}>My Registrations</Text>
              </TouchableOpacity>


              {isClubOwner && (
                <TouchableOpacity
                  style={[styles.navItem, styles.activeNavItem]}
                  onPress={() => handleNavigation("/events/add")}
                >
                  <Ionicons name="add-circle-outline" size={20} color="#09090b" />
                  <Text style={[styles.navText, { color: "#09090b", fontWeight: "700" }]}>
                    Add Event
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: "row", // Backdrop on left, Sidebar on right
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sidebarContainer: {
    width: width * 0.75,
    maxWidth: 300,
    backgroundColor: "#ffffff",
    height: "100%",
    borderLeftWidth: 1,
    borderLeftColor: "#e4e4e7",
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 44 : StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f4f4f5",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoImage: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#09090b",
  },
  navSection: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  activeNavItem: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
  },
  navText: {
    fontSize: 16,
    color: "#3f3f46",
    marginLeft: 12,
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f4f4f5",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#f4f4f5",
  },
  logoutText: {
    fontSize: 16,
    color: "#ef4444",
    marginLeft: 12,
    fontWeight: "600",
  },
});
