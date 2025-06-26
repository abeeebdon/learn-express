import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import productRouter from "../routes/productRoute.mjs";
import userRouter from "../routes/userRoute.mjs";
import authRoute from "../routes/authRoutes.mjs";
import { connectDB } from "../utils/db.mjs";
import cors from "cors";
import bodyParser from "body-parser";
dotenv.config();

await connectDB();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(
  session({
    secret: "Abeeb",
    resave: true,
    saveUninitialized: "false",
    cookie: { maxAge: 60000 * 6 },
  })
);
app.use("/users", userRouter);
app.use("/products", productRouter);
app.use("/auth", authRoute);
app.options("*", cors());
//run at this port
const PORT = 3000;
// );

app.get("/", (req, res) => {
  return res.send("Welcome");
});

// app.post("/abeeb", checkSchema(addUserSchema), (req, res) => {
//   const result = validationResult(req);

//   if (!result.isEmpty())
//     return res.status(400).send(result.array().map((data) => data.msg));
//   const data = matchedData(req);
//   if (!data) res.sendStatus(400);
//   const newPost = { id: userArray.length + 1, ...data };

//   userArray.push(newPost);
//   return res.send(userArray);
// });
app.listen(PORT, () => {
  console.log(`Listening at ${PORT}`);
});
