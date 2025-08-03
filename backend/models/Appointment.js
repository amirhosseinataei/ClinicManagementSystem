const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  doctor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor" },
  patient_id: { type: mongoose.Schema.Types.ObjectId, ref: "Patient" },
  clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  date: Date,
  status: String,
});

module.exports = mongoose.model("Appointment", appointmentSchema);