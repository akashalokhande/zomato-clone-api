const { Schema, model } = require("mongoose");

const OrdersSchema = new Schema({
  order_id: { type: String },
  name: { type: String },
  mobile: { type: Number },
  email: { type: String },
  order_list: { type: Array },
  payment_id: { type: String },
  payment_status: { type: Boolean },
  totalAmount: { type: Number },
});

const OrdersModel = model("order", OrdersSchema, "orders");

module.exports = OrdersModel;
