const { Schema, model } = require("mongoose");

const MenuItemsSchema = new Schema({
  name: { type: String },
  description: { type: String },
  ingridients: { type: Array },
  restaurantId: { type: String }, // ← change to String
  image: { type: String },
  qty: { type: Number },
  price: { type: Number },
});

const MenuItemsModel = model("menuitem", MenuItemsSchema);

module.exports = MenuItemsModel;
