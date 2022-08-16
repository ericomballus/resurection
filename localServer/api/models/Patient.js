const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const PatientSchema = new Schema({
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
  age: { type: Number, default: 0 },
  sexe: { type: String, default: "" },
  religion: { type: String, default: "" },
  nationalite: { type: String, default: "" },
  created: { type: Date, default: Date.now },
});
PatientSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Patient", PatientSchema);
//module.exports = CustumerSchema;
