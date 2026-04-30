import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === "web") {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error("Local storage error:", e);
      }
      return;
    }
    return await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string) {
    if (Platform.OS === "web") {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error("Local storage error:", e);
        return null;
      }
    }
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string) {
    if (Platform.OS === "web") {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error("Local storage error:", e);
      }
      return;
    }
    return await SecureStore.deleteItemAsync(key);
  },
};
