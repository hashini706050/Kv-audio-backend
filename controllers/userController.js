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
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Error occurred during registration",
            details: error.message || error
        });
    }
}

export function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        User.findOne({ email }).then((user) => {
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            if (user.isBlocked) {
                return res.status(403).json({ error: "Your account is blocked. Please contact admin" });
            }

            const isPasswordCorrect = bcrypt.compareSync(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(403).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign(
                {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    phone: user.phone
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ message: "Login Successful", token: token, role: user.role });
        }).catch((error) => {
            console.error("Error finding user:", error);
            return res.status(500).json({ message: "Internal Server Error" });
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error occurred during login" });
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
    return req.user?.role === "customer";
}

export async function getAllUsers(req,res){
    if(isItAdmin(req)){
        try{
            const users = await User.find();
            res.json(users);

        }catch(e){
            res.status(500).json({error: "Failed to get users"})
        }
    }else{
        res.status(403).json({error: "Unauthorzed login attempt"})
    }
}

export async function blockOrUnblockUser(req, res) {
    const email = req.params.email;

    if (isItAdmin(req)) {
        try {
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const isBlocked = !user.isBlocked;

            await User.updateOne(
                { email },
                { isBlocked }
            );

            res.status(200).json({
                message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`,
                email,
                isBlocked
            });
        } catch (e) {
            console.error("Error in blockOrUnblockUser:", e);
            res.status(500).json({ error: "Failed to block or unblock user" });
        }
    } else {
        res.status(403).json({ error: "Unauthorized login attempt" });
    }
}

export function getUser(req,res){
    if(req.user != null){
        res.json(req.user);
    }else{
        res.status(403).json({error : "error occured"})
    }
}
