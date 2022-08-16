const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ContratSchema = mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  montant: {
    type: Number,
    required: true,
  },
  startAt: String,
  endAt: String,
  created: { type: Date, default: Date.now },
  updateAt: { type: Date, default: Date.now },
  status: { type: Boolean, default: false },
});

module.exports = mongoose.model("Contrat", ContratSchema);
