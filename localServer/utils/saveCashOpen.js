var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const mongoose = require("mongoose");
const cashSchema = require("../api/models/Cash-opening");
const dbl = "customerDb";
function saveCashOpen(URL, adminId, storeId) {
  return new Promise(async (resolve, reject) => {
    let url =
      URL + `/cashOpen/${adminId}/all/last?db=${adminId}&storeId=${storeId}`;
    // `/invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&localServer=${true}&openCashDateId=${openCashDateId}`;
    var config = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(async (response) => {
        let result = response.data;
        console.log(
          "=====================cash open here avaible =====>",
          result
        );
        console.log(result[0]);
        /* setTimeout(() => {
          resolve(response.data);
        }, 25000);*/
        let doc = result[0];
        let database = await tenant.getModelByTenant(
          dbl,
          "cashopens",
          cashSchema
        );
        if (doc && doc._id) {
          database
            .find({ _id: doc._id })
            .lean()
            .exec((err, docs) => {
              if (docs && docs.length) {
                // reject("existe");
                // resolve(doc);
                database
                  .findOneAndUpdate(
                    { _id: doc._id },
                    { $set: doc },
                    { new: true }
                  )
                  .exec()
                  .then((res) => {
                    resolve(doc);
                  });
              } else {
                //
                database
                  .create(doc)
                  .then(async (resultat) => {
                    resolve(resultat);
                  })
                  .catch((err) => {
                    console.log(err);
                    reject(error);
                  });
              }
            });
        } else {
          resolve(false);
        }

        //
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
module.exports = saveCashOpen;
