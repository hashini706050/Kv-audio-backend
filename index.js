import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import StudentRouter from "./routes/studentroute.js";
import userRouter from "./routes/userRouter.js";  
import productRouter from "./routes/productRouter.js";
import jwt from 'jsonwebtoken';
import  dotenv from "dotenv";
import reviewRouter from "./routes/reviewRouter.js";
import inquiryRouter from "./routes/inquiryRouter.js";

dotenv.config();

let app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    let token = req.header('Authorization');
    
    if (token) {
        token = token.replace("Bearer ", "");  // Remove the "Bearer" prefix

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Invalid or expired token" });
            }
            req.user = decoded;  // Set the decoded user information in the request object
            next();  // Proceed to the next middleware or route handler
        });
    } else {
        return res.status(401).json({ message: "Authorization token required" });
    }
});


// MongoDB Connection
const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl);

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB connection established successfully");
});

app.use("/students", StudentRouter)
app.use("/users", userRouter)
app.use("/products",productRouter) 
app.use("/reviews", reviewRouter)
app.use("/inquiries", inquiryRouter)

// Start server
app.listen(3004, () => {
    console.log("Server is running on port 3004");
});

//admin@gmail.com 123
//cus@example.com 456