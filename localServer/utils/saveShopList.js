const productListSchema = require("../api/models/Product-List");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const dbl = "customerDb";
function saveProduct(product) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(
      dbl,
      "productlist",
      productListSchema
    );

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
              // console.log("product update here===>", result);
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
function getProductList(URL, adminId) {
  // console.log("hello===>", URL, adminId);
  return new Promise(async (resolve, reject) => {
    let url = URL + "/productlist/adminId/all" + `?db=${adminId}`;

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
        let result = response.data.product;
        let tab = [];
        if (result.length) {
          result.forEach(async (product) => {
            // console.log(product);
            try {
              let res = await saveProduct(product);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {
              // console.log(error);
            }
          });
        } else {
          resolve(result);
        }

        // ;
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}
module.exports = getProductList;
