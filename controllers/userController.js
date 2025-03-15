import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'; 

export async function registerUser(req, res) {
    try {
        const userData = req.body;

        // Hash the password asynchronously
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const newUser = new User(userData);

        await newUser.save();
        res.json({
            message: "User registered successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error occurred during registration",
            details: error.message || error
        });
    }
}

export function loginUser(req, res) {
    try {
        const data = req.body;

        User.findOne({ email: data.email }).then((user) => {
            if (user == null) {
                return res.status(404).json({ error: "User not found" });
            }

            const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

            if (isPasswordCorrect) {
                const token = jwt.sign({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    phone: user.phone
                }, process.env.JWT_SECRET, { expiresIn: '1h' });

                res.json({ message: "Login Successful", token: token });
            } else {
                res.status(403).json({ message: "Login Unsuccessful" });
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error occurred during login" });
    }
}

export function isItAdmin(req) {
    let isAdmin = false;

    if (req.user != null) {
        if (req.user.role === "admin") {  // Fixed comparison operator
            isAdmin = true;
        }
    }
    return isAdmin;
}

export function isItCustomer(req) {
    return req.user && req.user.role === "customer";  // Simple check
}
