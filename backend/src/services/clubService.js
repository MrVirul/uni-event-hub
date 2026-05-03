import Club from '../Models/Clubs.js';

export const createClub = async (clubData) => {
  const { name, description, image, owner } = clubData;

  const existingClub = await Club.findOne({ name });
  if (existingClub) {
    const error = new Error('Club name already exists');
    error.status = 400;
    throw error;
  }

  const club = new Club({
    name,
    description,
    image: image || `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(name)}`,
    owner,
  });

  await club.save();
  return club;
};

export const getClubs = async () => {
  return await Club.find().populate('owner', 'name email');
};

export const getUserClubs = async (userId) => {
  return await Club.find({ owner: userId });
};

export const getClubById = async (clubId) => {
  const club = await Club.findById(clubId).populate('owner', 'name email');
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }
  return club;
};

export const updateClub = async (clubId, userId, updateData) => {
  const club = await Club.findById(clubId);
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }

  if (club.owner.toString() !== userId.toString()) {
    const error = new Error('Not authorized to update this club');
    error.status = 403;
    throw error;
  }

  const updatedClub = await Club.findByIdAndUpdate(clubId, updateData, { new: true });
  return updatedClub;
};

export const deleteClub = async (clubId, userId) => {
  const club = await Club.findById(clubId);
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }

  if (club.owner.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this club');
    error.status = 403;
    throw error;
  }

  await Club.findByIdAndDelete(clubId);
  return { message: 'Club deleted successfully' };
};
