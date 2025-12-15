const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router();

const SAFE_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "skills",
  "about",
];

//get all the //*pending request for loggedInUser
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequestModel.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", SAFE_DATA);
    res.json({ message: "Data fetched Successfully", connections });
  } catch (err) {
    res.status(400).send("Somthing went wrong : " + err.message);
  }
});

//Get all connections of a user (accepted are connectoins)
userRouter.get("/user/connectoins", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);
    if (!connections) {
      throw new Error("Connections not found");
    }

    const data = connections.map((connection) => {
      // if (
      //   connection.fromUserId._id.toString() === loggedInUser._id.toString()
      // )
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.json({
      message: "connections found",
      data,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    //user cannot see -> himself, connectionAccepted, connectoinRejected, IgnoredProfile,
    const connectionRequests = await ConnectionRequestModel.find({
      $or:
        [
          { fromUserId: loggedInUser._id },
          { toUserId: loggedInUser._id }
        ],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    const usersFeed = await User.find({
      _id: { $nin: Array.from(hideUserFromFeed) },
    })
      .skip(skip)
      .limit(limit)
      .select(SAFE_DATA);

    res.json({
      message: "feed data found",
      usersFeed,
    });
  } catch (err) {
    res.status(400).json({
      message: "Error: " + err.message,
    });
  }
});
module.exports = userRouter;
