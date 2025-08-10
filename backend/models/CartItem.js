const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart', required: true },
  drug_id: { type: Schema.Types.ObjectId, ref: 'Drug', required: true },
  quantity: { type: Number, default: 1 },
}, { timestamps: true });

cartItemSchema.index({ cart_id:1, drug_id:1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);
