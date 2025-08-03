const mongoose = require("mongoose");

const loginSessionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  token: String,
  os: String,
  browser: String,
  expires_at: Date,
  created_at: Date,
});

module.exports = mongoose.model("LoginSession", loginSessionSchema);