// Import necessary modules
import express from "express";
import {
  login,
  logout,
  refresh,
  signup,
} from "../controllers/auth.controller.js";
import { verify_token } from "../middlewares/verify_token.js";

// Create router instance
const router = express.Router();

// Define routes for authentication
router.post("/login", login); // Route for user login
router.post("/signup", signup); // Route for user signup
router.post("/logout", logout); // Route for user logout
router.get("/refresh", verify_token, refresh); // Route for user logout

// Export the router
export default router;
