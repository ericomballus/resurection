const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
  name: String,
  description: String,
  created: { type: Date, default: Date.now },
  numberId: Number, // 1= company-admin, 2= manager, 3- warehouse, 4= cashier, 5= wairess, 6= super manager, 7= super warhouse, 8= super cashier, 9= caissiére magasin, 10= admin manager
});

module.exports = mongoose.model("UserRole", RoleSchema);

//module.exports = RoleSchema;
