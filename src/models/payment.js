const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    paymentId:{
        type: String,
    },
    orderId: {
      type: String,
      required: true,
    },
   status: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    receipt: {
      type: String,
      required: true,
    },
    notes: {
      fristName: {
        type: String,
      },
      LastName: {
        type: String,
      },
      memberShipType: {
        type: String,
      },
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("payment", paymentSchema);
