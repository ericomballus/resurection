const mongoose = require("mongoose");
let db = async (req, res, next) => {
  console.log("check database middleware =================>");

  next();
};

module.exports.db = db;
