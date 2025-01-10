require("dotenv").config();
const express = require("express");
const { User } = require("../db");
const jwt = require("jsonwebtoken");
const { signupSchema, signinSchema, updateBody } = require("../models/schemas");
const { authMiddleware } = require("../middlewares/auth");
const router = express.Router();
const JWT_SECRET = process.env.SECRET_KEY;

/* --------------------------------------------------- POST (signup) -------------------------------------------------*/

router.post("/signup", async (req, res) => {
  console.log(req.body);

  const { success } = signupSchema.safeParse(req.body);
  console.log(success);
  if (!success) {
    return res.status(411).json({
      message: "Email already taken / Incorrect inputs",
    });
  }

  const existingUser = await User.findOne({
    username: req.body.username,
  });

  if (existingUser) {
    return res.status(411).json({
      message: "Email already taken/Incorrect inputs",
    });
  }

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });

  const user = await User.create({
    username: req.body.username,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
  });

  // Generate JWT
  const token = jwt.sign(
    { id: user._Id, username: user.username, firstName: user.firstName }, // Payload
    JWT_SECRET // Secret key
  );

  // Respond with user ID and token
  res.status(201).json({
    message: "Signup successful",
    token: token,
  });
});

/* --------------------------------------------------- POST (signin) -------------------------------------------------*/

router.post("/signin", async (req, res) => {
  const { success } = signinSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }

  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      JWT_SECRET
    );

    res.json({
      token: token,
    });
    return;
  }

  res.status(411).json({
    message: "Error while logging in",
  });
});

/* --------------------------------------------------- PUT (update) -------------------------------------------------*/

router.put("/", authMiddleware, async (req, res) => {
  const { success } = updateBody.safeParse(req.body);
  if (!success) {
    res.status(411).json({
      message: "Error while updating information",
    });
  }

  await User.updateOne({ _id: req.userId }, req.body);

  res.json({
    message: "Updated successfully",
  });
});

/* --------------------------------------------------- GET ---------------------------------------------------------------*/

router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
