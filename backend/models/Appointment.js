const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
  doctor_id: { type: Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic', required: true },
  date: { type: Date, required: true },
  status: { type: String, default: 'scheduled' },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
