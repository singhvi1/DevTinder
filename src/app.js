const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParcer = require("cookie-parser");
const cors = require("cors");
const http = require("http")
require("dotenv").config();
require("./utils/cronjon");

app.use(express.json());
app.use(cookieParcer());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

//connecting DB and then listening to server
const server = http.createServer(app)
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("DataBase connection established");
    server.listen(process.env.PORT, () => {
      console.log(
        `server is successfully listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.log("Database not connceted " + err.message);
  });
