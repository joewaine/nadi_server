const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const orderSchema = mongoose.Schema({
  sandbox: {
    type: Boolean,
    required: [false]
  },
  timeClosed: {
    type: Number,
    required: [false],
  },
  email: {
    type: String,
    required: [true],
  },
  payInfo: {
    type: Object,
    required: [true],
  },
  orderInfo: {
    type: Object,
    required: [true],
  },
  void: {
    type: Boolean,
    required: [true],
  },
  upserveId: {
    type: String,
    required: [true],
  },
  status: {
    type: String,
    required: [true],
  },
  orderPosted: {
    type: Boolean,
    required: [true],
  },
  orderAccepted: {
    type: Boolean,
    required: [true],
  },
  shippingOrder: {
    type: Boolean,
    required: [true],
  },
  shipped: {
    type: Boolean,
    required: [true],
  },
  shippingInfo: {
    type: Object,
    required: [false],
  },
  acceptanceEmailSent: {
    type: Boolean,
    required: [true],
  },
  readyEmailSent: {
    type: Boolean,
    required: [true],
  },
  cancelled:{
    type: Boolean,
    required: [true]
  },
  partialFixedRefund:{
    type: Boolean,
    required: [true],
    default: false
  },
  amountRefunded:{
    type: Number,
    required: [true],
    default: 0 
  },
  tipRefunded:{
    type: Boolean,
    required: [true],
    default: false
  },

});

// orderSchema.statics.findByOrderId = async (id) => {
//     let _id = id;
//     const order = await Order.findOne({ _id });

//     if(!order) {
//         throw new Error({ error: "Invalid order id" });
//       }
//       // console.log(order)
//       return order
// }

//this method search for a order by email
orderSchema.statics.findByOrderEmail = async (email) => {
  const order = await Order.find({ email });
  // console.log(order)

  if (!order) {
    throw new Error({ error: "Invalid login details" });
  }

  return order;
};

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
