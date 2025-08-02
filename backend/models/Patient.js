const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  insurance_info: String,
  birth_date: Date,
});

module.exports = mongoose.model("Patient", patientSchema);