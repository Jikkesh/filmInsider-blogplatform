import mongoose from 'mongoose';
import User from '../models/auth.js';

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find();

        const allUserDetails = allUsers.map((user) => ({
            _id: user._id,
            name: user.name,
            about: user.about,
            tags: user.tags,
            joinedOn: user.joinedOn,
            browserType: user.browserType,
            browserVersion: user.browserVersion,
            osType: user.osType, 
            deviceType: user.deviceType,
            ipAddress: user.ipAddress,
            city: req.geolocation?.city || 'Unknown',
            latitude: req.geolocation?.coordinates ? req.geolocation.coordinates[0] : 'Unknown',
            longitude: req.geolocation?.coordinates ? req.geolocation.coordinates[1] : 'Unknown',
        }));

        res.status(200).json(allUserDetails);
    } catch (error) {
        res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
};

export const updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ message: 'User not found' });
    }

    try {
        const updatedProfile = await User.findByIdAndUpdate(
            _id, 
            { $set: { name, about, tags } }, 
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedProfile);
    } catch (error) {
        res.status(500).json({ message: `Error updating profile: ${error.message}` });
    }
};
