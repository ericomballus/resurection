const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const vendorSchema = mongoose.Schema({
  _id: Schema.Types.ObjectId,
  vendorId: { type: Schema.Types.ObjectId, ref: "User" },
  created: { type: Date, default: Date.now },
  retailerId: { type: Schema.Types.ObjectId, ref: "User" },
  vendorConfirm: { type: Boolean, default: false },
  unsubscribed: { type: Boolean, default: false },
});
vendorSchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = mongoose.model("Vendor", vendorSchema);
