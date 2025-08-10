const mongoose = require('mongoose');
const { Schema } = mongoose;

const drugSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String },
  max_dosage: { type: String },
  side_effects: { type: String },
  benefits: { type: String },
  usage: { type: String },
  allergy: { type: String },
  interactions: { type: String },
  description: { type: String },
  approved: { type: Date },
  prescription_required: { type: Boolean, default: false },
  type: { type: String },
  status: { type: String, default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Drug', drugSchema);
