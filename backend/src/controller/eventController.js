import Event from '../Models/Event.js';
import fs from 'fs';
import path from 'path';

export const createEvent = async (req, res) => {
  try {
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const event = await Event.create({ ...req.body, image, createdBy: req.user._id });
    res.status(201).json({ success: true, message: 'Event created', data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email').sort({ date: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (req.file) {
      if (event.image) {
        const oldPath = path.join('uploads', path.basename(event.image));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      req.body.image = `/uploads/${req.file.filename}`;
    }
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Event updated', data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    if (event.createdBy.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Not authorized' });
    if (event.image) {
      const imagePath = path.join('uploads', path.basename(event.image));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }
    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });
    res.status(200).json({ success: true, imageUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
