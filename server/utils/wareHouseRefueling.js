const mongoose = require("mongoose");
const User = require("../api/models/user");
const companySchema = require("../api/models/Company_Setting");
const checkIfRefuelingFromWarehouse = async (id, req) => {
  return new Promise(async (resolve, reject) => {
    let Company = await req.tenancy.getModelByTenant(
      req.dbUse,
      "company",
      companySchema
    );
    try {
      let user = await User.find({ _id: id });
      let storeType = user[0].storeType;
      let setting = await Company.find({
        adminId: id,
      });
      if (setting[0].refueling_from_warehouse_production) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = checkIfRefuelingFromWarehouse;
