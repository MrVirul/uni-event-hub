import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, StyleSheet, Platform } from 'react-native';
import { getBookingHistory, updateBookingStatus, deleteBooking, updateBookingDetails } from '../services/BookingService';
import { Ionicons } from "@expo/vector-icons";

interface Booking {
  _id: string;
  eventId?: {
    title?: string;
  };
  status: string;
  contactNumber?: string;
  specialNotes?: string;
}

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [contactNumber, setContactNumber] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getBookingHistory();
      setBookings(data.bookings || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch booking history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id: string) => {
    try {
      await deleteBooking(id);
      Alert.alert('Success', 'Booking canceled successfully');
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };


  const handleOpenEdit = (booking: Booking) => {
    setSelectedBookingId(booking._id);
    setContactNumber(booking.contactNumber || "");
    setSpecialNotes(booking.specialNotes || "");
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    if (!contactNumber.trim()) {
      Alert.alert('Validation Error', 'Contact number is required.');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedBookingId) {
        await updateBookingDetails(selectedBookingId, contactNumber, specialNotes);
        Alert.alert('Success', 'Booking details updated successfully');
        setEditModalVisible(false);
        setBookings((prev) =>
          prev.map((b) => (b._id === selectedBookingId ? { ...b, contactNumber, specialNotes } : b))
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update booking details');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: Booking }) => (
    <View style={styles.card}>
      <Text style={styles.eventTitle}>
        {item.eventId?.title || 'Unknown Event'}
      </Text>
      
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Status: {item.status}</Text>
      </View>
      
      {item.contactNumber ? (
        <Text style={styles.detailText}>Contact: {item.contactNumber}</Text>
      ) : null}
      
      {item.specialNotes ? (
        <Text style={[styles.detailText, styles.italicText]}>Notes: {item.specialNotes}</Text>
      ) : null}
      
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleOpenEdit(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => handleCancelBooking(item._id)}
        >
          <Text style={styles.actionButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>My Registrations</Text>
      {bookings.length === 0 ? (
        <Text style={styles.emptyText}>No registrations found.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      {/* Edit Booking Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Registration Details</Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color="#71717a" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Contact Number *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., +1 234 567 890"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />
              
              <Text style={styles.inputLabel}>Special Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Dietary requirements, accessibility needs, etc."
                value={specialNotes}
                onChangeText={setSpecialNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <TouchableOpacity 
                style={[styles.submitModalBtn, submitting && styles.submitModalBtnDisabled]}
                onPress={handleEditSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.submitModalBtnText}>Update Details</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#EEF2FF',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  statusText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  italicText: {
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attendButton: {
    backgroundColor: '#10B981',
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#09090b",
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3f3f46",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#09090b",
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  textArea: {
    minHeight: 80,
  },
  submitModalBtn: {
    backgroundColor: "#0f172a",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitModalBtnDisabled: {
    backgroundColor: "#94a3b8",
  },
  submitModalBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
