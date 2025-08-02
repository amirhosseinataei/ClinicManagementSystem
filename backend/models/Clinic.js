const mongoose = require("mongoose");

const clinicSchema = new mongoose.Schema({
  name: String,
  address: String,
  supervisor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Clinic", clinicSchema);