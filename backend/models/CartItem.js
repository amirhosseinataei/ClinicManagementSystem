const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  cart_id: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  drug_id: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" },
  quantity: Number,
});

module.exports = mongoose.model("CartItem", cartItemSchema);