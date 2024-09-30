// Import necessary modules
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generate_token_and_set_cookie from "../utils/generate_token.js";

// Signup controller
export const signup = async (req, res) => {
  try {
    // Extract user details from request body
    const { f_name, l_name, username, password, conf_password, gender } =
      req.body;

    // Check if password and confirm password match
    if (password !== conf_password) {
      return res.status(400).json({ message: "Passwords don't match." });
    }

    // Check if the user already exists
    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate profile picture and avatar URLs based on user details
    const profile_pic = `https://avatar.iran.liara.run/username?username=${f_name}+${l_name}`;
    const avatar = `https://avatar.iran.liara.run/public/${
      gender === "male" ? "boy" : gender === "female" ? "girl" : ""
    }?username=${username}`;

    // Create a new user object
    const new_user = new User({
      f_name,
      l_name,
      username,
      password: hashedPassword,
      gender,
      profile_pic,
      avatar,
    });

    // Save the new user to the database
    await new_user.save();

    // Generate JWT token and set it in cookies
    generate_token_and_set_cookie(new_user._id, res);

    // Remove the password field from the user object before returning the response
    new_user.password = undefined;

    // Send success response with user details
    return res
      .status(201)
      .json({ message: "User created successfully", user: new_user });
  } catch (error) {
    // Log and return internal server error response
    console.log("Error in Signup Controller: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login controller
export const login = async (req, res) => {
  try {
    // Check if user is already authenticated
    if (req.user) return res.status(200).json(req.user);

    // Extract username and password from request body
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });

    // If user does not exist, return error
    if (!user) return res.status(400).json({ message: "Invalid Username" });

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    // If password is incorrect, return error
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Password" });

    // Generate JWT token and set it in cookies
    generate_token_and_set_cookie(user._id, res);

    // Remove the password field from the user object before returning the response
    user.password = undefined;

    // Send success response with user details
    return res
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (error) {
    // Log and return internal server error response
    console.log("Error in Login Controller: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout controller
export const logout = (req, res) => {
  try {
    // Clear the JWT token from cookies
    res.cookie("jwt", "", { maxAge: 0 });

    // Send success response
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    // Log and return internal server error response
    console.log("Error in Logout Controller: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login on Refresh controller
export const refresh = (req, res) => {
  try {
    // Extract user details set by the verify_token middleware
    const user = req.user;

    // Send success response
    return res.status(200).json(user);
  } catch (error) {
    // Log and return internal server error response
    console.log("Error in Refresh Controller: " + error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
