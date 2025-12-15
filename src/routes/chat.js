const express = require("express");
const chatRouter = express.Router();
const { userAuth } = require("../middleware/auth")
const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
const { SAFE_DATA } = require("../utils/constants");

chatRouter.get('/chat/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    try {
        let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName"
        });
        if (!chat) {
            chat = new Chat({
                participants: [userId, targetUserId],
                messages: []
            })
        }
        await chat.save()
        res.status(200).json(chat);
    } catch (err) {
        console.error(err)
    }
})

chatRouter.get('/chat/connection/:targetUserId', userAuth, async (req, res) => {
    const { targetUserId } = req.params;
    const userId = req.user._id;
    try {
        const connection =await ConnectionRequestModel.findOne({
            $or: [
                { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
            ]
        })
        if (!connection) {
            throw new Error("You are not a connection ")
        }
        const targetUser = await User.findById({ _id: targetUserId }).select(SAFE_DATA)
        res.status(200).json({
            data:targetUser
        })
    } catch (err) {
        console.error(err)
        res.status(404).json({
            messages: "not able to get connection info"
        })
    }
})
module.exports = chatRouter