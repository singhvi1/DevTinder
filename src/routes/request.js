const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const requestRouter = express.Router();
const User = require("../models/user");
const sendEmail=require("../utils/sendEmail")


requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user; //-->thorw err if no user present
      const fromUserId = user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["interested", "ignore"];
      const isAllowed = allowedStatus.includes(status);
      if (!isAllowed) {
        return res.status(400).json({
          message: "invalid status " + status,
        });
      }
      //Check wheter toUser exist:
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "user not found" });
      }

      //checking previous Connections:
      const existingConnectionReq = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionReq) {
        return res.status(400).json({
          message: `Connection already exists`,
        });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      //sending email
      const emailRes=await sendEmail.run("A new friend request from " + req.user.firstName, req.user.firstName + " is "+ status+ " in " + toUser.firstName);
      // console.log(emailRes)
      //sending connection request
      res.json({
        message:
          status === "interested"
            ? `${user?.firstName} send the connection request to ${toUser.firstName}`
            : `${user?.firstName} ignored the request of ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send("Somthing went wrong : " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      //data sanatisation
      const isAllowedStatus = ["accepted", "rejected"];
      const isAllowed = isAllowedStatus.includes(status);
      if (!isAllowed) {
        return res.json({
          message: "invalid request",
          status,
        });
      }
      //check wheter condition of  accepted/ rejected fullfilled:
      //request send from requestId to loggedInUser:check intrested req
      /**
       * _id:requestId
       * toUserId:loggedIn._id
       * status:"intrested"
       */
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection Request Not Found try again",
        });
      }

      //if i found a connection request of interested then
      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.json({
        message: "connection Request " + status,
        data,
      });
    } catch (err) {
      console.log(err.message);
      res.status(400).send("Something Went wrong" + err.message);
    }
  }
);

module.exports = requestRouter;
