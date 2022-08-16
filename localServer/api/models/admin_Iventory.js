const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const adminInventorySchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  cashOpening: { type: Schema.Types.ObjectId, ref: "cashopens" },
  averageQuantity: Number,
  beneficeTotal: Number,
  beneficeUnitaire: Number,
  count: Number,
  glace: Number,
  nonglace: Number,
  out: Number,
  pachat: Number,
  pvente: Number,
  quantity: Number,
  remaining: Number,
  more: Number,
  displayQty: Number,
  ristourneGenerate: Number,
  start: Number,
  totalSalesAmount: Number,
  name: String,
  productItemsId: { type: Schema.Types.ObjectId, ref: "productitems" },
  created: { type: Date, default: Date.now },
  adminId: String,
  storeId: String,
});
adminInventorySchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = adminInventorySchema;
