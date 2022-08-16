const billSchema = require("../api/models/Bill");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const mongoose = require("mongoose");
const dbl = "customerDb";
function saveInvoice(invoice) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(dbl, "bill", billSchema);
    database
      .find({ localId: invoice.localId })
      .lean()
      .exec((err, invoices) => {
        if (invoices && invoices.length) {
          if (typeof invoices[0]._id === "string") {
            console.log("idiiidid=========>", invoices[0]._id);
            database
              .findOneAndUpdate(
                { _id: invoices[0]._id },
                { $set: invoice },
                { new: true }
              )
              .exec()
              .then((res) => {
                resolve(res);
              });
          } else {
            console.log("============rien ici ici========");
            resolve(invoices);
          }
        } else {
          //
          database.create(invoice).then(async (resultat) => {
            resolve(resultat);
          });
        }
      });
  });
}
function getStoreBills(URL, adminId, openCashDateId) {
  return new Promise(async (resolve, reject) => {
    let url =
      URL +
      `/bill/admin/${adminId}/aggregate?db=${adminId}&localServer=${true}&openCashDateId=${openCashDateId}`;
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
        let result = response.data;
        console.log(
          "=====================all bills here =====>",
          result.length
        );

        let tab = [];
        if (result.length) {
          result.forEach(async (invoice) => {
            try {
              let res = await saveInvoice(invoice);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {
              console.log(error);
              tab.push(invoice);
              if (tab.length == result.length) {
                resolve(tab);
              }
            }
          });
        } else {
          resolve(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        reject(error);
      });
  });
}
module.exports = getStoreBills;
