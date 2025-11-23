const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const razorpayInstance = require("../utils/razerpay");
const Payment = require("../models/payment");
const { memberShipAmount } = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const User = require("../models/user");



paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { firstName, lastName, emailId } = req.user;
    console.log(req.user);
    const { memberShipType } = req.body;
    const order = await razorpayInstance.orders.create({
      amount: memberShipAmount[memberShipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      partial_payment: false,
      notes: {
        firstName: firstName,
        lastName: lastName,
        emailId: emailId,
        memberShipType: memberShipType,
      },
    });
    console.log(order);

    //save it in my db
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });
    const savedPayment = await payment.save();
    //return my order details to frontend
    return res.json({
      message: "order created",
      data: { ...savedPayment.toJSON(), keyId: process.env.RAZERPAY_KEY },
    });
  } catch (err) {
    return res.status(400).json({
      msg: err?.reason + " razorPayment create payment failure",
      data: err,
    });
  }
});


paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers("X-Razorpay-Signature");
    // const webhookSignature=req.get["X-Razorpay-Signature"];
    const isWbhookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZERPAY_WEBHOOK_SECRET,
    );
    if (!isWbhookValid) {
      return res.status(400).json({ msg: "webhook signature is invalid" })
    }
    const paymentDetails = req.body.payload.payment.entity;
    const payment = await payment.findOne({ orderId: paymentDetails.order_id })
    payment.status = paymentDetails.status
    //update the user memeberShip
    const user = await User.findOne({ _id: payment.userId })
    user.isPremium = true;
    user.memeberShipType = payment.notes.memeberShipType;
    console.log(paymentDetails)
    console.log("paymentDetails")
  } catch (err) {
    console.error(err);
    return res.json({
      message: "webhook error " + err.message,
      data: err,
    });
  }
});

module.exports = paymentRouter;
