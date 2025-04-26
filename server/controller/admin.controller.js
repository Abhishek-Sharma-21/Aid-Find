import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.model.js";
import donorFindModel from "../models/donor-find.model.js";

export const adminSginup = async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Check if username already exists
    const existingUser = await Admin.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ error: "Username already taken." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user with hashed password
    const newUser = new Admin({ username, password: hashedPassword });

    // Save user to DB
    await newUser.save();

    // Create JWT token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      message: "User registered successfully.",
      token,
      user: { id: newUser._id, username: newUser.username, token },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error during signup." });
  }
};

export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    // Find the user
    const user = await Admin.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful.",
      token,
      user: { id: user._id, username: user.username, token },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error during login." });
  }
};

export const deleteDonor = async (req, res) => {
  const { donorId } = req.params;
  console.log(donorId);

  try {
    const deletedDonor = await donorFindModel.findByIdAndDelete(donorId);

    if (!deletedDonor) {
      return res.status(404).json({ error: "Donor not found." });
    }

    res.status(200).json({ message: "Donor deleted successfully." });
  } catch (error) {
    console.error("Error deleting donor:", error);
    res.status(500).json({ error: "Server error while deleting donor." });
  }
};
