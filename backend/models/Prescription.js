const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  notes: String,
});

module.exports = mongoose.model("Prescription", prescriptionSchema);