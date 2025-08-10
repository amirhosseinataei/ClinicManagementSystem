const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  target_type: { type: String, enum: ['doctor','drug','clinic'], required: true },
  target_id: { type: Schema.Types.ObjectId, required: true },
  score: { type: Number, min: 0, max: 5 },
  comment: { type: String },
  appointment_id: { type: Schema.Types.ObjectId, ref: 'Appointment' },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
