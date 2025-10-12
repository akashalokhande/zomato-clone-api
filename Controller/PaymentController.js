require("dotenv").config();
const axios = require("axios");
const OrdersModel = require("../Model/OrdersModel");

// Load Cashfree test credentials from .env
const APP_ID = process.env.CASHFREE_APP_ID;
const SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const TEST_MODE = true; // true for sandbox, false for production

// Save order to DB
let _saveNewOrder = async (data) => {
  try {
    const newOrder = new OrdersModel({
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
    console.error(error);
    return false;
  }
};

// Generate Order token / Order ID from Cashfree
module.exports.genOrderId = async (req, res) => {
  try {
    const { amount } = req.body;

    const url = TEST_MODE
      ? "https://sandbox.cashfree.com/pg/orders"
      : "https://api.cashfree.com/pg/orders";

    const payload = {
      order_id: `order_${Date.now()}`,
      order_amount: amount,
      order_currency: "INR",
      order_note: "Zomato Clone Order",
      customer_details: {
        customer_name: "Test User",
        customer_phone: "9999999999",
        customer_email: "test@example.com",
      },
      return_url: "https://yourfrontend.com/payment-success",
    };

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": APP_ID,
      "x-client-secret": SECRET_KEY,
    };

    const { data } = await axios.post(url, payload, { headers });

    if (data.status === "OK") {
      res.status(200).send({ status: true, order: data });
    } else {
      res.status(500).send({ status: false, message: data.reason });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: false, message: "Unable to generate order" });
  }
};

// Verify payment (Webhook or frontend call)
module.exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  // Cashfree recommends verifying signature using HMAC-SHA256
  const crypto = require("crypto");
  const body = order_id + payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === signature) {
    req.body.payment_status = true;
    await _saveNewOrder(req.body);
    res.status(200).send({ status: true });
  } else {
    res.status(400).send({ status: false });
  }
};

// Get user's order list
module.exports.OrderList = async (req, res) => {
  const { email } = req.params;
  const orders = await OrdersModel.find({ email });
  res.send({ status: true, my_order: orders });
};
