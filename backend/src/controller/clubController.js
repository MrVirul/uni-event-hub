import * as clubService from '../services/clubService.js';

export const createClub = async (req, res, next) => {
    try {
        const { name, description, image } = req.body;
        const owner = req.user.id; // From auth middleware

        if (!name || !description) {
            const error = new Error('Name and description are required');
            error.status = 400;
            throw error;
        }

        const club = await clubService.createClub({ name, description, image, owner });
        res.status(201).json({
            message: 'Club created successfully',
            club
        });
    } catch (error) {
        next(error);
    }
};

export const getClubs = async (req, res, next) => {
    try {
        const clubs = await clubService.getClubs();
        res.status(200).json({ clubs });
    } catch (error) {
        next(error);
    }
};

export const getMyClubs = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const clubs = await clubService.getUserClubs(userId);
        res.status(200).json({ clubs });
    } catch (error) {
        next(error);
    }
};

export const getClub = async (req, res, next) => {
    try {
        const { id } = req.params;
        const club = await clubService.getClubById(id);
        res.status(200).json({ club });
    } catch (error) {
        next(error);
    }
};

export const updateClub = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const updateData = req.body;

        const club = await clubService.updateClub(id, userId, updateData);
        res.status(200).json({
            message: 'Club updated successfully',
            club
        });
    } catch (error) {
        next(error);
    }
};

export const deleteClub = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const result = await clubService.deleteClub(id, userId);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};
