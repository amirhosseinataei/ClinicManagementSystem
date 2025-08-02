const mongoose = require("mongoose");

const labRequestSchema = new mongoose.Schema({
  appointment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment" },
  type: String,
  status: String,
  result_file_url: String,
});

module.exports = mongoose.model("LabRequest", labRequestSchema);