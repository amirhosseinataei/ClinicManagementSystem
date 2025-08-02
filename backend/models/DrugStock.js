const mongoose = require("mongoose");

const drugStockSchema = new mongoose.Schema({
  drug_id: { type: mongoose.Schema.Types.ObjectId, ref: "Drug" },
  clinic_id: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  quantity: Number,
});

module.exports = mongoose.model("DrugStock", drugStockSchema);