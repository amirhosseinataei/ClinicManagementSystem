const mongoose = require('mongoose');
const { Schema } = mongoose;

const prescriptionItemSchema = new Schema({
  prescription_id: { type: Schema.Types.ObjectId, ref: 'Prescription', required: true },
  drug_id: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
  dosage: { type: String },
  frequency: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('PrescriptionItem', prescriptionItemSchema);
