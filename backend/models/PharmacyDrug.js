const mongoose = require('mongoose');
const { Schema } = mongoose;

const pharmacyDrugSchema = new Schema({
  pharmacy_id: { type: Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  drug_id: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
  quantity: { type: Number, default: 0 },
  approved_by: { type: Schema.Types.ObjectId, ref: 'User' },
  manufacture_date: { type: Date },
  expiry_date: { type: Date },
  status: { type: String, default: 'active' },
}, { timestamps: true });

pharmacyDrugSchema.index({ pharmacy_id:1, drug_id:1 }, { unique: true });

module.exports = mongoose.model('PharmacyDrug', pharmacyDrugSchema);
