import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Attended'],
        default: 'Pending'
    },
    contactNumber: {
        type: String,
        required: true
    },
    specialNotes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

export default mongoose.model('Booking', bookingSchema);
