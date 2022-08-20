const mongoose = require("mongoose");
const User = require("../api/models/user");
const companySchema = require("../api/models/Company_Setting");
const checkIfCount = async (id, req) => {
  return new Promise(async (resolve, reject) => {
    let Company = mongoose.model("company", companySchema);

    try {
      let user = await User.find({ _id: id });
      let storeType = user[0].storeType;
      let setting = await Company.find({
        adminId: id,
      });
      if (
        setting.check_service_quantity &&
        storeType.length == 1 &&
        storeType.includes("services")
      ) {
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

module.exports = checkIfCount;
