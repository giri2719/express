import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genPassword } from "../genPassword.js";
import { clinet } from "../index.js";
const router = express.Router();

router.post("/signup", async function (request, response) {
  const { user, password } = request.body;
  const hashpassword = await genPassword(password);
  const newUser = {
    username: username,
    password: hashpassword,
  };
  const result = await clinet.db("ag").collection("users").insertOne(newUser);
  response.send(result);
});
router.post("/login", async function (request, response) {
  const { username, password } = request.body;

  const userFromDB = await client
    .db("ag")
    .collection("users")
    .findOne({ username: username });

  console.log(userFromDB);
  if (!userFromDB) {
    response.status(401).send({ message: "Invalid credentials" });
    return;
  }
  const storePassword = userFromDB.password;
  const isPasswordMatch = await bcrypt.compare(password, storePassword);

  if (isPasswordMatch) {
    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
    response.send({ message: "Successfull login", token: token });
  } else {
    response.status(401).send({ message: "Invalid credentials" });
  }
});
export const userRouter = router;
