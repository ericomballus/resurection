const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CustumerSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  phone: String, //deux champ numero de telephone
  created: { type: Date, default: Date.now },
  quartier: { type: String, default: "" },
  ville: { type: String, default: "" },
  removeUser: { type: Boolean, default: false },
  codeClient: { type: String, default: "" },
  Role: { type: Number, default: 0 },
  reduction: { type: Number, default: 0 },
  chefEquipe: String,
  solde: { type: Number, default: 0 },
  customerType: { type: String, default: "" },
});
module.exports = mongoose.model("Custumer", CustumerSchema);
//module.exports = CustumerSchema;
