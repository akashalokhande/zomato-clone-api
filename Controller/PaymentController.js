require('dotenv').config();
const axios = require("axios");
const OrdersModel = require("../Model/OrdersModel");


const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID;
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY;
const CASHFREE_SANDBOX_URL = "https://sandbox.cashfree.com/pg/orders";


const _saveNewOrder = async (data) => {
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
    console.error("Error saving order:", error);
    return false;
  }
};

// Generate Cashfree order
module.exports.genOrderId = async (req, res) => {
  try {
    const { amount, customer_name, customer_email, customer_phone } = req.body;

    // Unique order id
    const orderPayload = {
      order_id: `ORDER_${Date.now()}`,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_name,
        customer_email,
        customer_phone,
      },
      order_meta: {
        return_url: "https://yourfrontend.com/payment-success", // update to your frontend route
        notify_url: "https://yourbackend.com/payment/callback", // optional webhook
      },
    };

    const headers = {
      "Content-Type": "application/json",
      "x-client-id": CASHFREE_APP_ID,
      "x-client-secret": CASHFREE_SECRET_KEY,
    };

    const response = await axios.post(CASHFREE_SANDBOX_URL, orderPayload, { headers });

    if (response.data.status === "OK") {
      res.status(200).send({ status: true, order: response.data });
    } else {
      res.status(400).send({ status: false, message: response.data.message });
    }
  } catch (error) {
    console.error("Error generating order:", error);
    res.status(500).send({ status: false, error });
  }
};

// Verify payment (Cashfree callback)
module.exports.verifyPayment = async (req, res) => {
  try {
    const data = req.body;

    // For testing in sandbox, assume success if order_status is PAID
    if (data.order_status === "PAID") {
      data.payment_status = true;
      await _saveNewOrder(data);
      res.status(200).send({ status: true });
    } else {
      res.status(200).send({ status: false });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).send({ status: false });
  }
};

// List orders by email
module.exports.OrderList = async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await OrdersModel.find({ email });
    res.status(200).send({ status: true, my_order: orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send({ status: false });
  }
};
