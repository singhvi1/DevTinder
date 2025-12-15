const { Chat } = require("../models/chat");
const ConnectionRequestModel = require("../models/connectionRequest")
const initializeSocket = (server) => {
    const socket = require("socket.io");
    const io = socket(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        }
    })
    io.on("connection", (socket) => {
        //handle events
        socket.on("joinChat", ({ userId, targetUserId, firstName }) => {
            const roomId = [userId, targetUserId].sort().join("_");
            socket.join(roomId)
            // console.log(firstName + " joined Room : " + roomId)
        });

        socket.on("sendMessage", async ({ firstName, userId, targetUserId, text }) => {
            const roomId = [userId, targetUserId].sort().join("_");

            try {
                //check if userId and targetUserId are friends
                const connection = await ConnectionRequestModel.findOne({
                    $or: [
                        { fromUserId: userId, toUserId: targetUserId, status: "accepted" },
                        { fromUserId: targetUserId, toUserId: userId, status: "accepted" },
                    ]
                })
                if (!connection) {
                    console.error("you are not a connection ")
                    throw new Error("You are not a connection ")
                }
                let chat = await Chat.findOne({
                    participants: { $all: [userId, targetUserId] }
                })
                if (!chat) {
                    chat = new Chat({
                        participants: [userId, targetUserId],
                        messages: []
                    })
                }
                chat.messages.push({
                    senderId: userId,
                    text,
                })
                await chat.save()
                io.to(roomId).emit("messageReceived", { firstName, text })
                // console.log(firstName + " " + text)
            } catch (err) {
                console.error(err)
            }

        });

        socket.on("disconnect", () => { });
    })
}

module.exports = initializeSocket;