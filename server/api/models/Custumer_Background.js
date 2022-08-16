const mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
const custumerBackgroundSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
  filename: String,
  originalName: String,
  display: { type: Boolean, default: true },
});

//midlleware here
custumerBackgroundSchema.plugin(mongoosePaginate);
//module.exports = mongoose.model("cashOpen", cashOpeningSchema);
module.exports = custumerBackgroundSchema;
