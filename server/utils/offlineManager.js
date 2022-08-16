//const User = require("../api/models/user");
const StorageModel = require("../api/models/Storage");
const offlineHandler = async (req, res, next) => {
  if (req.query.adminId) {
    //  console.log("hello admin Id", req.query.adminId);
  }
  if (req.method == "POST" || req.method == "PATCH") {
    let doc = {
      url: req.url,
      data: req.body,
      status: false,
      method: req.method,
    };
  }
  next();
};

module.exports = offlineHandler;
