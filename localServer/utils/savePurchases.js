const purchaseSchema = require("../api/models/Purchase");
var path = require("path");
const tenant = require("../getTenant");
const axios = require("axios");
const mongoose = require("mongoose");
const dbl = "customerDb";
function savePurchase(purchase, URL, adminId) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(
      dbl,
      "purchase",
      purchaseSchema
    );
    database
      .find({ _id: purchase._id })
      .lean()
      .exec((err, products) => {
        if (products && products.length) {
          /* database
                      .findOneAndUpdate(
                        { _id: product._id },
                        { $set: product },
                        { new: true }
                      )
                      .exec()
                      .then((result) => {
                        resolve(result);
                      });*/
        } else {
          database.create(purchase).then(async (resultat) => {
            resolve(resultat);
          });
        }
      });
  });
}
function getAllPurchases(URL, adminId) {
  //  return new Promise(async (resolve, reject) => {
  let url = URL + `/purchase/${adminId}?db=${adminId}&sc=${true}`;
  // let url = URL + "/billard/adminId/all" + `?db=${adminId}`;
  console.log("hello PURCAHSE list===>", url);
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
      let result = response.data["docs"];
      let tab = [];
      if (result.length) {
        result.forEach(async (product) => {
          // console.log(product);
          try {
            let res = await savePurchase(product, URL, adminId);
            console.log("retour ici purchase==>", res);
            tab.push(res);
            if (tab.length == result.length) {
              // resolve(tab);
            }
          } catch (error) {
            console.log(error);
          }
        });
      } else {
        // resolve(result);
      }

      //
    })
    .catch(function (error) {
      // console.log(error);
      //reject(error);
    });
  // });
}
module.exports = getAllPurchases;
