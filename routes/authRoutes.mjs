import express from "express";
import bodyParser from "body-parser";
import { Router } from "express";
import { ObjectId } from "mongodb";

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
    return user;
  } catch (error) {
    return null;
  }
};

// require fullName, password, email
router.post("/signup", async (req, res) => {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    return res
      .status(400)
      .send({ msg: "Email, password, and full name are required" });
  }
  if (password.length < 8) {
    return res.status(400).send({
      msg: "Password must be at least 8 characters long",
    });
  }

  try {
    const existingUser = await findUserByEmail(email); // ✅ await this

    if (existingUser) {
      return res.status(409).send({ msg: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // hash the password
    const newUser = {
      email: email,
      password: hashedPassword,
      fullName: fullName,
      createdAt: new Date(),
    };
    users.insertOne(newUser);
    res.send({ msg: "Signup successfully", user: newUser });
  } catch (err) {
    return res.status(500).send({ msg: "Failed to create user" });
  }
});

// login with email and password
// require email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ msg: "Email and password are required" });
  }
  try {
    const existingUser = await findUserByEmail(email); // ✅ await this
    if (!existingUser) {
      return res.status(404).send({ msg: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).send({ msg: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      secret_key, // Use the secret key from environment variables
      { expiresIn: "1h" }
    );
    res.send({ msg: "Login successfully", token, userId: existingUser._id });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error" });
  }
});

// get user profile by id
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.send({
      msg: "User profile retrieved successfully",
      user: {
        email: user.email,
        fullName: user.fullName,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error" });
  }
});

// update usr profile
router.put("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const { fullName, email, phone, username, website } = req.body;
  if (!fullName || !email) {
    return res.status(400).send({ msg: "Full name and email are required" });
  }
  try {
    const updatedUser = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { fullName, email, phone, username, website } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({ msg: "User not found" });
    }
    res.send({
      msg: "User profile updated successfully",
      user: {
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        username: updatedUser.username,
        website: updatedUser.website,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).send({ msg: "Internal server error" });
  }
});
export default router;
