const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the token from req cookies
  //validate the token
  //find the user

  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login 🚫")
    }
    const decodedObj = await jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decodedObj)
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    if (!user) {
      return res.send("user not found")
    }
    req.user=user
    next()
  } catch (err) {
    return res.status(400).send("Error : " + err.message);
  }
};

module.exports = {
  userAuth,
};
