import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import users from '../models/auth.js'

export const signup = async (req, res) => {
    const {name,email,password}= req.body;
    console.log(name , email , password);
    try{
        const existinguser = await users.findOne({ email });
        const userInfo = req.userInfo;

        if(existinguser){
            console.log("Already exist");
            return res.status(404).json({ message: "User already Exist."});
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = await users.create({ 
            name, 
            email, 
            password: hashedPassword , 
            browserType: userInfo.browser ,
            browserVersion: userInfo.browserVersion ,
            osType: userInfo.os,
            deviceType:userInfo.device,
            ipAddress:userInfo.ipAddress , }) ;

        const token = jwt.sign({ email: newUser.email, id:newUser._id}, process.env.JWT_Secret , { expiresIn: '1h'});
        res.status(200).json({ result: newUser, token });

        console.log("Successfully parsed");

    } catch(error){
        res.status(500).json("Something went worng...")
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existinguser = await users.findOne({ email });
        if(!existinguser){
            return res.status(404).json({ message: "User don't Exist."})
        }

        const isPasswordCrt = await bcrypt.compare(password, existinguser.password)
        if(!isPasswordCrt){
            return res.status(400).json({message : "Invalid credentials"})
        }
        const token = jwt.sign({ email: existinguser.email, id:existinguser._id}, "test" , { expiresIn: '1h'});
        res.status(200).json({ result: existinguser, token });
        console.log("Logged In")
    } catch (error)  {
        res.status(500).json("Something went worng...");
        console.log("passsword wrong");
    }
}