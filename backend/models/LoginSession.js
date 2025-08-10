const mongoose = require('mongoose');
const { Schema } = mongoose;

const loginSessionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  os: { type: String },
  browser: { type: String },
  expires_at: { type: Date },
}, { timestamps: { createdAt: 'created_at', updatedAt: false } });

module.exports = mongoose.model('LoginSession', loginSessionSchema);
