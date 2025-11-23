const Razorpay=require("razorpay")

var instance = new Razorpay({
  key_id: process.env.RAZERPAY_KEY,
  key_secret: process.env.RAZERPAY_SECRET_KEY,
});

module.exports=instance;