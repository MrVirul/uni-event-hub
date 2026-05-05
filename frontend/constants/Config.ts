import Constants from "expo-constants";

const getHostIp = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return hostUri.split(":").shift();
  }
  return "172.28.9.78"; // Fallback to current detected IP
};


const BACKEND_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__
    ? `http://${getHostIp()}:3000`
    : "https://eventhub-lrm3.onrender.com");

export const API_URL = BACKEND_URL;
export const API_BASE_URL = `${BACKEND_URL}/api`;