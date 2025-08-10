const mongoose = require('mongoose');
const { Schema } = mongoose;

const patientSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  insurance_info: { type: String },
  birth_date: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
