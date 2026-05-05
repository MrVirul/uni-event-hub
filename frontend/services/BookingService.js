import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/bookings`;

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const createBooking = async (eventId, contactNumber, specialNotes) => {
  const config = await getAuthHeaders();
  const response = await axios.post(API_URL, { eventId, contactNumber, specialNotes }, config);
  return response.data;
};

export const getBookingHistory = async () => {
  const config = await getAuthHeaders();
  const response = await axios.get(`${API_URL}/history`, config);
  return response.data;
};

export const updateBookingStatus = async (id, status) => {
  const config = await getAuthHeaders();
  const response = await axios.patch(`${API_URL}/${id}`, { status }, config);
  return response.data;
};

export const updateBookingDetails = async (id, contactNumber, specialNotes) => {
  const config = await getAuthHeaders();
  const response = await axios.put(`${API_URL}/${id}/details`, { contactNumber, specialNotes }, config);
  return response.data;
};

export const deleteBooking = async (id) => {
  const config = await getAuthHeaders();
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

export const getEventRegistrations = async (eventId) => {
  const config = await getAuthHeaders();
  const response = await axios.get(`${API_URL}/event/${eventId}`, config);
  return response.data;
};
