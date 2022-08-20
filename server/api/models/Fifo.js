const mongoose = require("mongoose");
var my = require("../../utils/checkExpired");
var Schema = mongoose.Schema;

const FifoSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: String,

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employe",
    required: true,
  },
  created: { type: Date, default: Date.now },
  expireAt: Date,
  quantity: { type: Number, default: 0 },
  quantityInit: { type: Number, default: 0 },
  isUse: { type: Boolean, default: false },
  actif: { type: Boolean, default: false },
});
FifoSchema.pre("init", () => {
  console.log("this moooonnnnn=====<");
});
FifoSchema.plugin(my, { index: true });
let fifoVirtual = FifoSchema.virtual("tempsRestant");
fifoVirtual.get(() => {
  return 12345;
});
fifoVirtual.set((nbr) => {
  console.log("this moooonnnnn=====<");
  console.log(nbr);
});
module.exports = mongoose.model("Fifo", FifoSchema);
