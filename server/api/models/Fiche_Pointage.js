const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const fichePointageSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  list: Array,
  open: { type: Boolean, default: true },
  adminId: String,
  storeId: String,
  created: { type: Date, default: Date.now },
});
fichePointageSchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = fichePointageSchema;
