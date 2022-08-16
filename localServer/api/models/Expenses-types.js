const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const ExpenseTypeSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now },
  name: String,
});
module.exports = ExpenseTypeSchema;
