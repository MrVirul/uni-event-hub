import Event from '../Models/Event.js';

export const createEvent = async (req, res) => {
  try {
    const { clubId, ...rest } = req.body;
    
    let imageData = null;
    if (req.file) {
      // Convert buffer to base64 string
      const base64Image = req.file.buffer.toString('base64');
      imageData = `data:${req.file.mimetype};base64,${base64Image}`;
    }

    const event = await Event.create({
      ...rest,
      club: clubId,
      image: imageData,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Event created', data: event });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const { clubId } = req.query;
    const filter = clubId ? { club: clubId } : {};
    
    const events = await Event.find(filter)
      .populate('createdBy', 'name email')
      .populate('club', 'name image')
      .sort({ createdAt: -1 });
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
      const base64Image = req.file.buffer.toString('base64');
      req.body.image = `data:${req.file.mimetype};base64,${base64Image}`;
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
    
    await event.deleteOne();
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadEventImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image provided' });
    
    const base64Image = req.file.buffer.toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${base64Image}`;
    
    res.status(200).json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
