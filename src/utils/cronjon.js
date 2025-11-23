const { subDays, startOfDay, endOfDay } = require("date-fns");
const cron = require("node-cron");
const ConnectionRequestModel = require("../models/connectionRequest");
const sendEmail=require("./sendEmail")


cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
    const presentMoment = new Date();
    const pendingReq = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");
    const listOfEmails = [
      ...new Set(pendingReq.map((req) => req.toUserId.emailId)),
    ];
    for (const email of listOfEmails) {
      //send email
      try {
        const res = await sendEmail.run("New Friend Request Pending For " + email, "there are so many friend request pending please login to tinderCopy.me and accept req")
        console.log(res)
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
