const mongoose = require('mongoose');
const { Schema } = mongoose;

const pharmacySchema = new Schema({
  name: { type: String },
  address: { type: String },
  license_number: { type: String },
  active: { type: Boolean, default: true },
  supervisor_id: { type: Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
