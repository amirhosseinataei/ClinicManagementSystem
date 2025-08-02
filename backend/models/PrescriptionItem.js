const mongoose = require("mongoose");

const prescriptionItemSchema = new mongoose.Schema({
  prescription_id: { type: mongoose.Schema.Types.ObjectId, ref: "Prescription" },
  drug_id: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" },
  dosage: String,
  frequency: String,
});

module.exports = mongoose.model("PrescriptionItem", prescriptionItemSchema);