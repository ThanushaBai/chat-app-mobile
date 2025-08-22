import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js"; // Assuming you have a cloudinary setup

export const signup = async (req, res) => {
    const{ name, email, password, profilePicture } = req.body;
    try{
        if(!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        } 

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword, profilePicture });

        if (newUser) {
            await newUser.save(); // Save first
            generateToken(newUser._id, res); // Then generate token

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            });        
        } else {
            res.status(400).json({ message: "User creation failed" });
        }

    } catch (error) {
        console.log(error); // <-- Add this line
        console.log("error in signup controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res); // Should only set cookie, not send response

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        console.log(error); // Log full error
        console.log("error in login controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error);
        console.log("error in logout controller:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePicture } = req.body;
        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!profilePicture) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        // Add logging to debug
        console.log("Uploading profile picture to Cloudinary...");
        
        // Set upload options to optimize for profile pictures
        const uploadOptions = {
            folder: "profile_pictures",
            transformation: [
                { width: 400, height: 400, crop: "fill" },
                { quality: "auto" }
            ],
            resource_type: "image"
        };

        // Upload to Cloudinary with optimized settings
        const uploadResponse = await cloudinary.uploader.upload(
            profilePicture,
            uploadOptions
        );
        
        console.log("Cloudinary upload successful:", uploadResponse.secure_url);

        // Update user profile picture
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                profilePicture: uploadResponse.secure_url,
                updatedAt: new Date()
            },
            { new: true }
        ).select('-password'); // Exclude password from response

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log("User updated successfully:", {
            id: updatedUser._id,
            profilePicture: updatedUser.profilePicture
        });

        // Return the complete user object
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profilePicture: updatedUser.profilePicture,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        });
    } catch (error) {
        console.log("Full error in updateProfile:", error);
        console.log("Error message in updateProfile:", error.message);
        
        // Check for Cloudinary-specific errors
        if (error.http_code) {
            return res.status(error.http_code).json({ 
                message: "Image upload failed: " + error.message 
            });
        }
        
        res.status(500).json({ message: "Internal server error" });
    }
};

export const checkAuth = (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
