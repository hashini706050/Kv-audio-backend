import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import StudentRouter from "./routes/studentroute.js";
import userRouter from "./routes/userRouter.js";  
import productRouter from "./routes/productRouter.js";
import jwt from 'jsonwebtoken';

let app = express();

app.use(bodyParser.json());

app.use((req,res,next) => {
    let token = req.header
    ('Authorization')

    if(token != null){
        token = token.replace("Bearer ", "");
        jwt.verify(token,"kv-secret-89!",
        (err,decoded) => {
            if(!err){
                req.user = decoded;
            }
        });
        
    }
    next(); 
});

// MongoDB Connection
const mongoUrl = "mongodb+srv://admin:19661970ta@cluster09.gd6hu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster09";

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