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
import deliveryRouter from "./routes/deliveryRoute.js";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3004;

app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
    if (req.path === "/users/login"|| (req.method === "POST" && req.path === "/users")) {
      return next(); // Skip authentication check for login
    }
  
    let token = req.header('Authorization');
    if (!token) {
      return res.status(401).json({ message: "Authorization token required" });
    }
  
    token = token.replace("Bearer ", ""); // Remove "Bearer" prefix
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      req.user = decoded; // Attach user data to request
      next(); // Proceed
    });
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
app.use("/deliveries", deliveryRouter);

// Start the server and listen on the specified port
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

// Graceful shutdown handling to clean up resources
process.on('SIGINT', () => {
    console.log('Server shutting down...');
    server.close(() => {
      console.log('Server stopped, releasing port.');
      process.exit(0); // Exit the process after shutdown
    });
  });

// Handle errors like EADDRINUSE when the port is already in use
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Try a different port.`);
    }
  });

//admin@gmail.com 123
//cus@example.com 456