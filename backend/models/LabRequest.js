const mongoose = require('mongoose');
const { Schema } = mongoose;

const labRequestSchema = new Schema({
  appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  type: { type: String },
  status: { type: String, default: 'pending' },
  result_file_url: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('LabRequest', labRequestSchema);
