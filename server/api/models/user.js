const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const EmployeSchema = new Schema({
  name: String,
  password: String,
  poste: String,
  //email: String,
  role: Array,
  telephone: Number, //deux champ numero de telephone
});

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  company: String,
  city: String,
  email: String,
  password: String,
  role: String,
  telephone: Number,
  created: { type: Date, default: Date.now },
  employes: [EmployeSchema],
  vendor: [],
  delete: { type: Boolean, default: false },
  autorization: { type: Boolean, default: false },
  maxemploye: { type: Number, default: 2 },
  montant: { type: Number, default: 5000 },
  storeId: Array,
  venderRole: { type: Boolean, default: false },
  storeType: Array,
  userConnection: {
    lastConnection: { type: Date },
    // allConnection: [],
  },
  lastRequest: { type: String, default: " " },
  multi_store: { type: Boolean, default: false },
  displayType: { type: String, default: "card " },
});

userSchema.methods.handleConnection = function (url) {
  let dat = Date.now();
  this.userConnection.lastConnection = dat;
  this.lastRequest = url;
  // this.userConnection.allConnection.push({ connect: dat });
  return this.save();
};

module.exports = mongoose.model("User", userSchema);
