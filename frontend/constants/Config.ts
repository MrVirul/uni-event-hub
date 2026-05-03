const BACKEND_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (__DEV__ ? "http://localhost:3000" : "https://eventhub-lrm3.onrender.com");

export const API_URL = BACKEND_URL;
export const API_BASE_URL = `${BACKEND_URL}/api`;
