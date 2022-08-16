const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const consigneSchema = mongoose.Schema({
  // _id: Schema.Types.ObjectId,
  adminId: String,
  customerId: String,
  invoiceId: String,
  storeId: String,
  commandes: [],
  articles: [],
  created: { type: Date, default: Date.now },
  Fund: { type: Boolean, default: false },
});
consigneSchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = consigneSchema;
