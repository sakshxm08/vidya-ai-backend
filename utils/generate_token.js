// Import JWT module
import jwt from "jsonwebtoken";

// Function to generate JWT token and set it in a cookie
const generate_token_and_set_cookie = (user_id, res) => {
  // Generate JWT token with user ID payload and JWT secret, with expiration of 15 days
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  // Set JWT token in a cookie with specified options
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, // Max age of cookie (15 days in milliseconds)
    httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    sameSite: "strict", // Restrict cookie to same-site requests
    secure: process.env.NODE_ENV !== "development", // Only send cookie over HTTPS in non-development environments
  });
};

// Export the function
export default generate_token_and_set_cookie;
