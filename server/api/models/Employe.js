const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const EmployeSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  adminEmail: String,
  password: String,
  poste: { type: String, default: "non defini" },
  ville: { type: String, default: "non defini" },
  quartier: { type: String, default: "non defini" },
  phone: { type: String, default: "000000000" },
  email: String,
  role: Array,
  telephone: String, //deux champ numero de telephone
  storeId: String,
  isRetailer: { type: Boolean, default: false },
  productsToSale: { type: Array, default: [] },
  percentage: { type: Number, default: 0 },
  container_info: { type: Object, default: { test: true } },
});

module.exports = mongoose.model("Employe", EmployeSchema);
