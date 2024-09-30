import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to verify JWT token
export const verify_token = async (req, res, next) => {
  try {
    // Extract JWT token from cookies
    const token = req.cookies.jwt;

    // Check if token exists
    if (!token)
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is not verified, return unauthorized error
    if (!decoded)
      return res
        .status(401)
        .json({ message: "Unauthorized - Token Not Verified" });

    // Find user by ID from the decoded token and exclude password field
    const user = await User.findById(decoded.user_id).select("-password");

    // If user is not found, return not found error
    if (!user)
      return res.status(404).json({
        message: "User not found",
      });

    // Attach the user object to the request for further middleware/routes to use
    req.user = user;

    // Proceed to the next middleware or route
    next();
  } catch (error) {
    // Log and return internal server error response
    console.log("Error in Verify Token Middleware: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
