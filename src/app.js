const express = require("express");
const app = express();
const { connectDB } = require("./config/database");
const cookieParcer = require("cookie-parser");
const cors =require('cors')


app.use(express.json());
app.use(cookieParcer());
app.use(cors({
  origin:"http://localhost:5173",         //whiteListing this domain😊
  credentials:true,
}))

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/",userRouter);

//connecting DB and then listening to server
connectDB()
  .then(() => {
    console.log("DataBase connection established");
    app.listen(7777, () => {
      console.log("server is successfully listening on port 7777");
    });
  })
  .catch((err) => {
    console.log("Database not connceted " + err.message);
  });
