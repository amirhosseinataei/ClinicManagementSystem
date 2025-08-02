const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  specialization: String,
  degree: String,
  license_number: String,
});

module.exports = mongoose.model("Doctor", doctorSchema);