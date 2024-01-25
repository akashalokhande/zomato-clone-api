const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LocationsSchema = new Schema({
  name: { type: String },
  city_id: { type: Number },
  location_id: { type: Number },
  city: { type: String },
  country_name: { type: String },
});

const LocationsModel = mongoose.model("location", LocationsSchema, "locations");

module.exports = LocationsModel;
