const invoiceSchema = require("../api/models/invoice");
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
    let database = await tenant.getModelByTenant(dbl, "invoice", invoiceSchema);
    database
      .find({ localId: invoice.localId })
      .lean()
      .exec((err, invoices) => {
        if (invoices && invoices.length) {
          // reject("existe");
          /* console.log(invoices);
          database
            .findOneAndUpdate(
              { _id: invoices[0]._id },
              { $set: invoice },
              { new: true }
            )
            .exec()
            .then((res) => {
              resolve(res);
            });*/

          if (typeof invoices[0]._id === "string") {
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
            console.log("============rien ici invoices========");
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
function getStoreInvoices(URL, adminId, openCashDateId) {
  return new Promise(async (resolve, reject) => {
    // let url =
    // URL +
    // "/transaction/admin/" +
    // `${adminId}?db=${adminId}&storeId=${storeId}`;
    // let url = "http://18.157.225.135:3000" + "/products/adminId/" + adminId;
    let url =
      URL +
      `/invoice/admin/paieinvoice/${adminId}/sale/false?db=${adminId}&localServer=${true}&openCashDateId=${openCashDateId}`;
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

        //
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}
module.exports = getStoreInvoices;
