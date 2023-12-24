const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multipartMiddleWare = multipart();
require('dotenv').config();

const User = require("./models/User");

const app = express();

const { JWT_SECRET_KEY } = require("./config/config");

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  res.json({ message: "Hello Nigga!" });
});

app.post("/check-account", async (req, res) => {
  console.log("Boohoo nigga");
  try {
    const email = req.body.email;
    console.log(email);

    if (!email) {
      return res.json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.json({ message: "Account exists" });
    } else {
      return res.json({ message: "Account not found" });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  console.log("Welcome back nigga");
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        message: "Email and password are required",
        token: null,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "Email doesn't exist", token: null });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.json({ message: "Invalid credentials", token: null });
    }

    const token = jwt.sign({ email: user.email }, JWT_SECRET_KEY, {});

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error", token: null });
  }
});

app.post("/create-account", async (req, res) => {
  console.log("Welcome nigga");
  try {
    const { email, password, userName } = req.body;

    console.log(email, password, userName);

    if (!email || !password || !userName) {
      return res.json({
        message: "Email, password, and userName are required",
        token: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email: email,
      password: hashedPassword,
      userName: userName,
    });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email }, JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.json({ message: "User registered successfully", token: token });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.json({ message: "Email already exists", token: null });
    }

    res.json({ message: "Internal server error", token: null });
  }
});

app.post("/verify-token", async (req, res) => {
  console.log("Oye Papaji");
  try {
    const { token } = req.body;

    if (!token) {
      return res.json({ message: "Token is required", email: null });
    }

    let decoded;

    try {
      decoded = jwt.verify(token, JWT_SECRET_KEY);
    } catch (error) {
      return res.json({ message: "Token is not valid", email: null });
    }

    if (decoded && decoded.email) {
      res.json({ message: "Token is valid", email: decoded.email });
    } else {
      res.json({ message: "Invalid token structure", email: null });
    }
  } catch (error) {
    console.error(error);
    res.json({ message: "Internal server error", email: null });
  }
});

app.listen(5000, "0.0.0.0", () => {
  console.log("Server started on port 5000.");
});

const start = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/dermi_check", {
      family: 4,
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
