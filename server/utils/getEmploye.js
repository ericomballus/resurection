const mongoose = require("mongoose");
const EmployeSchema = require("../api/models/Employe");
const tenant = require("../getTenant");
//const companySchema = require("../api/models/Company_Setting");
const employeAccount = async (req) => {
  return new Promise(async (resolve, reject) => {
    let db = "maeri";
    try {
      let user = await EmployeSchema.findById(req.body.employeId);
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

module.exports = employeAccount;
