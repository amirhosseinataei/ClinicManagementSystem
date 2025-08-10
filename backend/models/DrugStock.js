const mongoose = require('mongoose');
const { Schema } = mongoose;

const drugStockSchema = new Schema({
  drug_id: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
  clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  quantity: { type: Number, default: 0 },
}, { timestamps: true });

drugStockSchema.index({ drug_id:1, clinic_id:1 }, { unique: true });

module.exports = mongoose.model('DrugStock', drugStockSchema);
