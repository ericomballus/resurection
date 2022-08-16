const transactionSchema = require("../api/models/Transaction");
//const tenant = require("../getTenant");
warehouseTransaction = async (req, obj, data) => {
  console.log("incomming data is  here ===>", obj);
  delete obj["_id"];
  obj["adminId"] = req.params.adminId;
  if (obj.prod && obj.prod["storeId"]) {
    obj["storeId"] = obj.prod["storeId"];
  }

  let a = await req.tenancy.getModelByTenant(
    req.dbUse,
    "transaction",
    transactionSchema
  );
  const tenant = a;
  tenant
    .create(obj)
    .then((data) => {
      data["prod"] = obj["prod"];
      req.io.sockets.emit(`${req.params.adminId}transactionNewItem`, {
        data: data,
        prod: obj,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = warehouseTransaction;
