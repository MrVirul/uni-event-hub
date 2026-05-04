import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  category: { type: String, enum: ['Academic','Sports','Cultural','Social','Workshop','Other'], default: 'Other' },
  image: { type: String, default: null },
  capacity: { type: Number, required: true, min: 1 },
  registeredCount: { type: Number, default: 0 },
  club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Upcoming','Ongoing','Completed','Cancelled'], default: 'Upcoming' },
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
