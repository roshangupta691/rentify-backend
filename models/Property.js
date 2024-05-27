// models/Property.js
const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
  title: String,
  description: String,
  address: String,
  city: String,
  state: String,
  area: Number,
  bedrooms: Number,
  bathrooms: Number,
  rentPrice: Number,
  likes: Number,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Property", propertySchema);
