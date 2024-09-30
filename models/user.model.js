// Import necessary modules
import { Schema, model } from "mongoose";

// Define user schema
const user_schema = new Schema(
  {
    // First name of the user, required field
    f_name: { type: String, required: true },
    // Last name of the user, required field
    l_name: { type: String, required: true },
    // Unique username of the user, required field
    username: { type: String, unique: true, required: true },
    // Password of the user, required field with minimum length constraint
    password: { type: String, required: true, minlength: 6 },
    // Gender of the user, required field with predefined enum values
    gender: { type: String, required: true, enum: ["male", "female", "other"] },
    // Profile picture URL of the user, default empty string
    profile_pic: { type: String, default: "" },
    // Avatar URL of the user, default empty string
    avatar: { type: String, default: "" },
  },
  // Enable timestamps to automatically track createdAt and updatedAt fields
  { timestamps: true }
);

// Create User model using the defined schema
const User = model("user", user_schema);

// Export User model
export default User;
