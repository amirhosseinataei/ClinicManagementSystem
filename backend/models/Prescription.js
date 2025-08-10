const mongoose = require('mongoose');
const { Schema } = mongoose;

const prescriptionSchema = new Schema({
  appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true },
  notes: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
