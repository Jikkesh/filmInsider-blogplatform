import express from 'express';

import { login, signup } from '../controllers/auth.js'
import { getAllUsers, updateProfile } from '../controllers/users.js'
import auth from '../middleware/auth.js'

const userRoutes = express.Router();

userRoutes.post('/signup', signup)
userRoutes.post('/login', login)
userRoutes.get('/users', getAllUsers)
userRoutes.patch('/update/:id', auth, updateProfile)

export default userRoutes;