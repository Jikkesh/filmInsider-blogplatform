import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import users from '../models/auth.js';

export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });

        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,
            browserType: req.userInfo.browser,
            browserVersion: req.userInfo.browserVersion,
            osType: req.userInfo.os,
            deviceType: req.userInfo.device,
            ipAddress: req.userInfo.ipAddress
        });

        res.status(201).json();
        console.log("Signup successful");
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Something went wrong during signup." });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User does not exist." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: existingUser, token });
        console.log("Login successful");
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Something went wrong during login." });
    }
};
