import userModel from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) =>{
    try {
        const { name, email, password, role } = req.body;
        if(!name || !email || !password || !role){
            return res.status(400).json({ success: false, message: "Please enter all details" });
        }
        const existingEmail = await userModel.findOne({email});
        if(existingEmail){
            return res.status(400).json({ success: false, message: "User with this email already exists!" })
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new userModel({
            name,
            email,
            password : hashedPassword,
            role
        });
        await user.save();
        const token = jwt.sign({
            userId : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        }, process.env.JWT_SECRET, { expiresIn : "7d" });
        return res.status(201).json({ success: true, message: "User Registered Successfully",token });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server Error", error: error.message });
    }
};

const login = async (req, res) =>{
    try {
        const { email, password } = req.body;
        if(!email || !password){
            return res.status(400).json({ success: false, message: "Please enter all details" });
        }
        const user = await userModel.findOne({email});
        if (!user) {
            return res.status(401).json({ success: false, message: "User with this email does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ success: false, message: "Invalid Credentials" });
        }
        const token = jwt.sign({
            userId : user._id,
            name : user.name,
            email : user.email,
            role : user.role
        },process.env.JWT_SECRET, { expiresIn : "7d"});
        return res.status(200).json({ success: true, message: "Login Successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message })
    }
};

export { register, login };