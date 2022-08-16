const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const cashOpeningSchema = mongoose.Schema({
  open: { type: Boolean, default: true },
  openDate: { type: Date },
  adminId: String,
  user: { type: String, default: "noId" },
  cashFund: Number,
  closeDate: { type: Date },
  ouverture: String,
  fermeture: String,
  closing_cash: Number,
  makeInventory: { type: Boolean, default: false },
  storeId: String,
  inventoryalreadyexists: { type: Boolean, default: false },
  expense: { type: Number, default: 0 }, //depense
  recipe: { type: Number, default: 0 }, //recette ou vente
});
cashOpeningSchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = cashOpeningSchema;
