const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true, unique: true },
  password: String,
  national_code: { type: String, required: true, unique: true },
  sms_code: String,
  is_phone_verified: Boolean,
  role: String,
  clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  current_login_token: String,
});

module.exports = mongoose.model("User", userSchema);