const express = require("express");
const User = require("../models/user");
const validator = require("validator");
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcryptjs");
// const cookieParcer = require("cookie-parser");
// app.use(cookieParcer());

const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid Email");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credential");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      });

      res.json({
        message: "Login Successfull !!",
        data: user,
      });
    } else {
      throw new Error("Invalid Crendential");
    }
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    //creating a new instance of User model
    const user = new User(req.body);
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
    });
    res.json({
      message: "User added successfully",
      data: savedUser,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("logout successfull");
});
module.exports = authRouter;
