
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
        socket.on("joinChat", ({userId, targetUserId,firstName}) => {
            const roomId=[userId, targetUserId].sort().join("_");
            socket.join(roomId)
            console.log(firstName + " joined Room : "+ roomId)
        });
        socket.on("sendMessage", ({firstName,userId,targetUserId,text}) => {
            const roomId=[userId,targetUserId].sort().join("_");
            io.to(roomId).emit("messageReceived",{firstName, text})
            console.log(firstName + " " + text)
         });
        socket.on("disconnect", () => { });
    })
}

module.exports = initializeSocket;