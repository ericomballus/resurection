const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const HospitalisationSchema = new Schema({
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
    //medecin id
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
  startAt: { type: Date }, //date de debut
  endAt: { type: Date }, //date de fin
  actif: { type: Boolean, default: true },
});
module.exports = mongoose.model("Hospitalisation", HospitalisationSchema);
