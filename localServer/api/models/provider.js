const mongoose = require("mongoose");

const commandeSchema = new Schema({
  custumername: { type: String },
  custumer_id: { type: String },
  cart: { type: Object, require: true },
  Date: { type: Date, default: Date.now }
});

const custuinfoSchema = new Schema({
  // matiere: String,
  custumername: { type: String },
  custumer_id: { type: String },
  DateAbonnement: { type: Date, default: Date.now }
});

const providerSchema = mongoose.Schema({
  nom: String,
  secteur: { type: String, default: "inconnu" },
  telephone: { type: Number, default: 00000 },
  created: { type: Date, default: Date.now },
  listcommande: [commandeSchema],
  listCustumers: [custuinfoSchema]
});

module.exports = mongoose.model("providers", providerSchema);
