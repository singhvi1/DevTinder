const express = require("express");
const { userAuth } = require("../middleware/auth");
const {
  validateEditProfileData,
  validateEditPassword,
} = require("../utils/validation");
const profileRouter = express.Router();
const bcrypt = require("bcryptjs");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateEditProfileData(req);
    if (!isEditAllowed) {
      throw new Error("Invalid Edit request");
    }
    const loggedInUser = req.user;
    // console.log(`Before Update ${loggedInUser}`);

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    // console.log(`After update ${loggedInUser}`);
    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName} updated successully  `,
      data: loggedInUser,
    });
    // res.send(`${loggedInUser.firstName} updated successully  `);
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  //check user login by userAuth -> user
  //only CurrPass & newPassword should be present in req.body
  //check currPass same ? newPassword is strong
  //bycrpt newPass and update it in db

  try {
    const isAllowed = validateEditPassword(req);
    if (!isAllowed) {
      throw new Error("Password change Not Allowed");
    }
    const { currPassword, newPassword } = req.body;
    const user = req.user;
    const isPassWordSame = user.validatePassword(currPassword);
    if (!isPassWordSame) {
      throw new Error("Password Change not allwoed");
    }
    const HashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = HashedPassword;
    await user.save();
    res.json({
      message: `password changed for ${user.firstName}`,
      data: HashedPassword,
    });
  } catch (err) {
    res.status(500).send("Error : " + err.message);
  }
});

module.exports = profileRouter;
