import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import StudentRouter from "./routes/studentroute.js";
import userRouter from "./routes/userRouter.js";  
import productRouter from "./routes/productRouter.js";
import jwt from 'jsonwebtoken';
import  dotenv from "dotenv";

dotenv.config();


let app = express();

app.use(bodyParser.json());

app.use((req,res,next) => {
    let token = req.header
    ('Authorization')

    if(token != null){
        token = token.replace("Bearer ", "");
        jwt.verify(token, process.env.JWT_SECRET,
        (err,decoded) => {
            if(!err){
                req.user = decoded;
            }
        });
        
    }
    next(); 
});

// MongoDB Connection
const mongoUrl = process.env.MONOGO_URL;

mongoose.connect(mongoUrl);

const connection = mongoose.connection;

connection.once("open", () => {
    console.log("MongoDB connection established successfully");
});

app.use("/students", StudentRouter)
app.use("/users", userRouter)
app.use("/products",productRouter) 

// Start server
app.listen(3004, () => {
    console.log("Server is running on port 3004");
});