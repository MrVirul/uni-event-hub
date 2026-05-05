import Booking from '../Models/Booking.js';

// Service to create a booking
export const createBooking = async (userId, eventId, contactNumber, specialNotes) => {
    const existingBooking = await Booking.findOne({ userId, eventId });
    if (existingBooking) {
        throw new Error('User is already registered for this event');
    }

    const newBooking = new Booking({
        userId,
        eventId,
        contactNumber,
        specialNotes
    });

    return await newBooking.save();
};

// Service to get booking history
export const getBookingHistory = async (userId) => {
    return await Booking.find({ userId }).populate('eventId');
};

// Service to update booking status
export const updateBookingStatus = async (id, status) => {
    if (!['Pending', 'Attended'].includes(status)) {
        throw new Error('Invalid status value');
    }

    const booking = await Booking.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!booking) {
        throw new Error('Booking not found');
    }

    return booking;
};

// Service to update booking form details
export const updateBookingDetails = async (id, contactNumber, specialNotes) => {
    const booking = await Booking.findByIdAndUpdate(
        id,
        { contactNumber, specialNotes },
        { new: true, runValidators: true }
    );

    if (!booking) {
        throw new Error('Booking not found');
    }

    return booking;
};

// Service to delete a booking
export const deleteBooking = async (id) => {
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
        throw new Error('Booking not found');
    }

    return booking;
};

// Service to get all bookings for a specific event
export const getEventBookings = async (eventId) => {
    return await Booking.find({ eventId }).populate('userId', 'name email studentNumber');
};
