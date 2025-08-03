const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  target_type: String,
  target_id: mongoose.Schema.Types.ObjectId,
  score: Number,
  comment: String,
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
});

module.exports = mongoose.model("Review", reviewSchema);