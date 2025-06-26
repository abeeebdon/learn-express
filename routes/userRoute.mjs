import { Router } from "express";
import express from "express";
import { validationResult, checkSchema, matchedData } from "express-validator";
import { addNewUserSchema } from "../utils/validation.mjs";
import { connectDB } from "../utils/db.mjs";
import { ObjectId } from "mongodb";
import { authenticateJWT } from "../utils/protected.mjs"; // Import the JWT authentication middleware
const router = Router();

router.use(express.json());
const db = await connectDB();
const users = db.collection("users");

//get all Users
router.get("/", authenticateJWT, async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      const userArray = await users.find({ name: name }).toArray();
      return res.send(userArray);
    }
    // if (typeof name === "string" && name.trim() !== "") {
    //   const users = await db.find({ name: name }).toArray();

    //   return res.send(users);
    // }

    const userArray = await users.find().toArray();
    return res.send(userArray);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//get User by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  const reqData = await users.findOne({ _id: new ObjectId(id) });
  if (!reqData) return res.sendStatus(404);
  return res.send(reqData);
});

// add User
router.post("/", checkSchema(addNewUserSchema), async (req, res) => {
  try {
    const result = validationResult(req);
    const data = matchedData(req);
    if (!result.isEmpty())
      return res.status(400).send(result.array().map((data) => data.msg));
    const newUser = data;

    const resp = await users.insertOne(newUser);

    return res.status(201).json({ success: true, data: resp });
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

//edit user details
router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const { name, email } = req.body;
  const updatedUser = { name, email };
  const reqData = await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedUser }
  );

  return res.send(reqData);
});

//delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const reqData = await users.deleteOne({ _id: new ObjectId(id) });

  return res.send(reqData);
});

export default router;
