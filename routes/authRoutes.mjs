import express from "express";
import bodyParser from "body-parser";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "../utils/db.mjs"; // Assuming connectDB is a function that connects
const router = Router();
router.use(express.json());
router.use(bodyParser.json());

const db = await connectDB(); //connect to the database
const users = db.collection("users");
const secret_key = process.env.SECRET_KEY || "default_secret_key"; // Use a default secret key if not set
//signup
const findUserByEmail = async (email) => {
  try {
    const user = await users.findOne({ email: email }); // or just { email }
    console.log("Found user:", user);
    return user;
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
};
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ msg: "Email and password are required" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters long",
    });
  }

  try {
    const existingUser = await findUserByEmail(email); // ✅ await this

    if (existingUser) {
      return res.status(409).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    const newUser = { email: email, password: hashedPassword };
    users.insertOne(newUser);
    res.send({ msg: "Signup successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create user" });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ msg: "Email and password are required" });
  }
  try {
    const existingUser = await findUserByEmail(email); // ✅ await this
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      secret_key, // Use the secret key from environment variables
      { expiresIn: "1h" }
    );
    res.send({ msg: "Login successfully", token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
