import * as bookingService from '../services/bookingService.js';

// Create a booking
export const createBooking = async (req, res) => {
  try {
    const { eventId, contactNumber, specialNotes } = req.body;
    const userId = req.user.id; // from auth middleware

    if (!contactNumber) {
      return res.status(400).json({ message: 'Contact number is required' });
    }

    const booking = await bookingService.createBooking(
      userId,
      eventId,
      contactNumber,
      specialNotes
    );

    res.status(201).json({ message: 'Event registration successful', booking });
  } catch (error) {
    console.error('Error in createBooking:', error);
    if (error.message === 'User is already registered for this event') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during booking creation' });
  }
};

// Get logged-in user's booking history
export const getBookingHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await bookingService.getBookingHistory(userId);

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error in getBookingHistory:', error);
    res.status(500).json({ message: 'Server error while fetching booking history' });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await bookingService.updateBookingStatus(id, status);

    res.status(200).json({ message: 'Booking status updated', booking });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    if (error.message === 'Invalid status value') {
      return res.status(400).json({ message: error.message });
    }
    if (error.message === 'Booking not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during status update' });
  }
};

// Update booking details (contactNumber, specialNotes)
export const updateBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { contactNumber, specialNotes } = req.body;

    if (!contactNumber) {
      return res.status(400).json({ message: 'Contact number is required' });
    }

    const booking = await bookingService.updateBookingDetails(id, contactNumber, specialNotes);

    res.status(200).json({ message: 'Booking details updated successfully', booking });
  } catch (error) {
    console.error('Error in updateBookingDetails:', error);
    if (error.message === 'Booking not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during booking details update' });
  }
};

// Cancel (delete) a booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    await bookingService.deleteBooking(id);

    res.status(200).json({ message: 'Booking successfully canceled' });
  } catch (error) {
    console.error('Error in deleteBooking:', error);
    if (error.message === 'Booking not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error during booking cancellation' });
  }
};

// Get all bookings for an event
export const getEventBookings = async (req, res) => {
  try {
    const { eventId } = req.params;
    const bookings = await bookingService.getEventBookings(eventId);
    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Error in getEventBookings:', error);
    res.status(500).json({ message: 'Server error while fetching event bookings' });
  }
};
