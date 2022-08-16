const mongoose = require("mongoose");
const User = require("../api/models/user");
const tenant = require("../getTenant");
const companySchema = require("../api/models/Company_Setting");
const userSetting = async (id, req) => {
  return new Promise(async (resolve, reject) => {
    let db = "maeri";
    if (req.dbUse) {
      db = req.dbUse;
    }

    let Company = await tenant.getModelByTenant(db, "company", companySchema);
    try {
      let user = await User.find({ _id: id });
      // let storeType = user[0].storeType;
      console.log(user[0].role);
      if (user[0].role == "adminmaeri") {
        resolve(user[0]);
      } else {
        let setting = await Company.find({
          adminId: id,
        });
        if (setting) {
          resolve(setting);
        } else {
          resolve(false);
        }
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = userSetting;
