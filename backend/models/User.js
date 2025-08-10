const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String },
  phone: { type: String, required: true, unique: true },
  password: { type: String },
  national_code: { type: String, required: true, unique: true },
  sms_code: { type: String },
  is_phone_verified: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  clinic_id: { type: Schema.Types.ObjectId, ref: 'Clinic' },
  current_login_token: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
