const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const managerInventorySchema = mongoose.Schema({
  employeId: String,
  created: { type: Date, default: Date.now },
  adminId: String,
  Inventory: Array,
  storeId: String,
  cashClose: Number,
});
managerInventorySchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = managerInventorySchema;
