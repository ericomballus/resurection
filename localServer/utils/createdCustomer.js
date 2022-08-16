const mongoose = require("mongoose");
const Custumer = require("../api/models/Custumer");
const Employe = require("../api/models/Employe");

module.exports = async (req, res, next) => {
  try {
    let emp = await Employe.find({
      name: req.body.userName,
      adminId: req.body.adminId,
    }).exec();
    if (emp && emp[0].role) {
      let arr = [];
      arr = emp[0].role;
      console.log(arr[0]);
      if (arr.length == 1) {
        if (arr[0].numberId == 4) {
          req.body["role"] = arr[0].numberId;
        }
      }
    }
    if (req.body.cart && req.body.cart.customer) {
      const user = req.body.cart.customer;
      /// console.log(req.body.cart.customer);
      if (user["_id"]) {
        req["customerId"] = user["_id"];
        next();
      } else {
        user["adminId"] = req.body.adminId;
        const custumer = new Custumer(user);
        custumer.save().then((data) => {
          req["customerId"] = data["_id"];
          next();
        });
      }
    } else {
      req["customerId"] = "vide";
      next();
    }
  } catch (error) {
    console.log("customer created failed");
  }
};
