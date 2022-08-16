const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const inventorySchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  cashOpening: { type: Schema.Types.ObjectId, ref: "cashopens" },
  listsStart: Array,
  listsEnd: Array,
  open: { type: Boolean, default: true },
  adminId: String,
  storeId: String,
});
inventorySchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = inventorySchema;
