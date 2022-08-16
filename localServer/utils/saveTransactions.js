const transactionSchema = require("../api/models/Transaction");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const mongoose = require("mongoose");
const dbl = "customerDb";
function saveTransaction(product) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(
      dbl,
      "transaction",
      transactionSchema
    );

    //  let url = req.protocol + "://" + "localhost:3000" + req.url;
    database
      .find({ _id: product._id })
      .lean()
      .exec((err, products) => {
        if (products && products.length) {
          // reject("existe");
          database
            .findOneAndUpdate(
              { _id: product._id },
              { $set: product },
              { new: true }
            )
            .exec()
            .then((result) => {
              //console.log("product update here===>", result);
              resolve(result);
            });
        } else {
          //
          database.create(product).then(async (resultat) => {
            resolve(resultat);
          });
        }
      });
  });
}
function getNotConfirmTansaction(URL, adminId, storeId) {
  return new Promise(async (resolve, reject) => {
    console.log("get trasaction fucntion start store====>", storeId);
    let url =
      URL +
      "/transaction/admin/" +
      `${adminId}?db=${adminId}&storeId=${storeId}`;
    // let url = "http://18.157.225.135:3000" + "/products/adminId/" + adminId;
    var config = {
      method: "GET",
      url: url,
      headers: {
        Authorization: "Basic Og==",
        "Content-Type": "application/json",
      },
    };

    axios(config)
      .then(function (response) {
        let result = response.data.docs;

        let tab = [];
        if (result.length) {
          result.forEach(async (product) => {
            // console.log(product);
            try {
              let res = await saveTransaction(product);

              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {
              tab.push(product);
              if (tab.length == result.length) {
                resolve(tab);
              }
              console.log(error);
            }
          });
        } else {
          resolve(result);
        }

        //
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}
module.exports = getNotConfirmTansaction;
