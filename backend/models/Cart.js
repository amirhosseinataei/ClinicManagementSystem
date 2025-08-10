const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
