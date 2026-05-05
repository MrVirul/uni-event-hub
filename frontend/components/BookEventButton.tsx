import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, Alert } from 'react-native';
import { createBooking } from '../services/BookingService';

interface BookEventButtonProps {
  eventId: string;
  onSuccess?: () => void;
}

export default function BookEventButton({ eventId, onSuccess }: BookEventButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleBookEvent = async () => {
    try {
      setLoading(true);
      await createBooking(eventId);
      Alert.alert('Success', 'Successfully registered for the event!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to book the event. Please try again.';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="bg-blue-600 py-3 px-6 rounded-xl flex-row justify-center items-center"
      onPress={handleBookEvent}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" size="small" />
      ) : (
        <Text className="text-white text-base font-bold">Book Event</Text>
      )}
    </TouchableOpacity>
  );
}
