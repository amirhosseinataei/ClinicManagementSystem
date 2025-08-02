const mongoose = require("mongoose");

const drugSchema = new mongoose.Schema({
  name: String,
  description: String,
  approved: Boolean,
  type: String,
  prescription_required: Boolean,
});

module.exports = mongoose.model("Drug", drugSchema);