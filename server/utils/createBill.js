const mongoose = require("mongoose");
const billSchema = require("../api/models/Bill");

module.exports = (req, res, order, next) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Bill = mongoose.model("bill", billSchema);
      // req.tenancy.getModelByTenant(req.dbUse, "bill", billSchema);
      let newBill = await Bill.create(order);
      resolve("ok");
    } catch (error) {
      console.log("error here ==>", error);
    }
  });
};
