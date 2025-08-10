const mongoose = require('mongoose');
const { Schema } = mongoose;

const doctorSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String },
  degree: { type: String },
  license_number: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
