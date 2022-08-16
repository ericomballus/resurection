const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const taxiCashOpeningSchema = mongoose.Schema({
  open: { type: Boolean, default: true },
  openDate: Date,
  adminId: String,
  cashFund: Number,
  closeDate: Date,
  ouverture: String,
  fermeture: String,
  closing_cash: Number,
});
taxiCashOpeningSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("taxicashOpen", taxiCashOpeningSchema);
//module.exports = cashOpeningSchema;
