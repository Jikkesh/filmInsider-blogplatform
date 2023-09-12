import mongoose from 'mongoose'
import users from '../models/auth.js'

export const getAllUsers = async (req, res) => {
    try {
        // const locationData = JSON.stringify(req.locationData); [will use this later] //
        
        const allUsers = await users.find();

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
            city: req.geolocation.city,
            latitude: req.geolocation.coordinates[0],
            longitude: req.geolocation.coordinates[1],
        }));

        res.status(200).json(allUserDetails);
        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateProfile = async (req, res) => {
    const { id: _id } = req.params;
    const { name, about, tags } = req.body;

    if(!mongoose.Types.ObjectId.isValid(_id)){
        return res.status(404).send('question unavailable...');
    }

    try {
        const updatedProfile = await users.findByIdAndUpdate( _id, { $set: { 'name': name, 'about': about, 'tags': tags }}, { new: true } )
        res.status(200).json(updatedProfile)
    } catch (error) {
        res.status(405).json({ message: error.message })
    }
}