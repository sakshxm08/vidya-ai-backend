// Import necessary modules
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
// Import route handlers
import authRoutes from "./routes/auth.routes.js";

// import { app, server } from "./socket/socket.js";

dotenv.config();

const app = express();

// Set the port number
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL, // Allow this origin
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
};

// Middleware setup
app.use(cors(corsOptions));
app.use(cookieParser()); // Parse cookies from incoming requests
app.use(express.json()); // Parse incoming requests with JSON payloads (for req.body)

// Route handlers setup
app.use("/api/auth", authRoutes); // Authentication routes

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}\nConnected to DB`)
    )
  )
  .catch((err) => console.error("Could not connect to MongoDB", err));
