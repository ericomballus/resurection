const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const OrdonnanceSchema = new Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employe",
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employe",
    required: true,
  },
  created: { type: Date, default: Date.now },
  medicamentList: { type: Array, default: [] },
  comments: { type: String, default: "" },
});
module.exports = mongoose.model("Ordonnance", OrdonnanceSchema);
//module.exports = CustumerSchema;
