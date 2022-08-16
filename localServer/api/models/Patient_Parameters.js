const mongoose = require("mongoose");
const { Schema } = mongoose;

const ParameterSchema = mongoose.Schema({
  matricule: String,
  temperature: Number,
  weight: Number,
  tension: Number,
  created: { type: Date, default: Date.now },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
});

module.exports = mongoose.model("Parameter", ParameterSchema);
