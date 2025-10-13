require('dotenv').config();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const OrdersModel = require("../Model/OrdersModel");

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const SECRET_ID = process.env.RAZORPAY_SECRET_ID;

var instance = new Razorpay({ key_id: KEY_ID, key_secret: SECRET_ID });

let _saveNewOrder = async (data) => {
  try {
    var newOrder = new OrdersModel({
      order_id: data.order_id,
      name: data.name,
      mobile: data.mobile,
      email: data.email,
      order_list: data.order_list,
      payment_id: data.payment_id,
      payment_status: data.payment_status,
      totalAmount: data.totalAmount,
    });
    await newOrder.save();
    return true;
  } catch (error) {
    return false;
  }
};

// Generate Order ID
module.exports.genOrderId = (req, res) => {
  let { amount } = req.body;
  var options = {
    amount: amount * 100,
    currency: "INR",
    receipt: "order_rcptid_11",
  };
  instance.orders.create(options, function (err, order) {
    if (err) {
      res.status(500).send({ status: false });
    } else {
      res.status(200).send({ status: true, order });
    }
  });
};

// Verify Payment
module.exports.verifyPayment = async (req, res) => {
  let data = req.body;
  let { payment_id, order_id, signature } = data;
  let body = order_id + "|" + payment_id;

  var expectedSignature = crypto
    .createHmac("sha256", SECRET_ID)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === signature) {
    data["payment_status"] = true;
    await _saveNewOrder(data);
    res.status(200).send({ status: true });
  } else {
    res.status(200).send({ status: false });
  }
};

// Get Orders by Email
module.exports.OrderList = async (req, res) => {
  try {
    const email = req.params.email;
    const orders = await OrdersModel.find({ email });
    res.status(200).send({ status: true, orders });
  } catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};
