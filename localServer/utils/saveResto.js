const manufactureduserschema = require("../api/models/Product-manufactured");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const tenant = require("../getTenant");
const axios = require("axios");
const dbl = "customerDb";
const ImagesStore = require("../api/models/ImagesStore");
const mongoose = require("mongoose");
function saveProduct(product, URL) {
  return new Promise(async (resolve, reject) => {
    let database = await tenant.getModelByTenant(
      dbl,
      "manufacturedUserSchema",
      manufactureduserschema
    );

    //  let url = req.protocol + "://" + "localhost:3000" + req.url;
    if (product.filename && product.filename.length) {
      const path = "./localimages2/" + product.filename;

      const dir = "./localimages2";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir); //creating folder
      }

      let url = product.url;
      let filename = product.filename;

      if (url && filename) {
        const writeStream = fs.createWriteStream(dir + "/" + filename);
        http
          .request(url, (response) => {
            let data = new Stream();
            response.on("data", (chunk) => {
              data.push(chunk);
            });
            response.on("end", () => {
              fs.writeFileSync("./localimages2/" + filename, data.read());
            });
          })
          .on("error", (err) => {
            console.log(
              "il ya erreur impossible de joindre le serveur distant"
            );
            reject(err);
          })
          .end(() => {
            // let url = `http://127.0.0.1:3030/images?filename=${product.filename}`;

            const Image = new ImagesStore({
              _id: new mongoose.Types.ObjectId(),
              adminId: product.adminId,
              filename: product.filename,
              originalname: product.filename,
            });
            Image.save().then((data) => {
              // let url = `http://127.0.0.1:3030/images/${data._id}`;
              let url = `${URL}/images/${data._id}`;
              product.url = url;
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
          });
      } else {
      }
    }
  });
}
function getProductResto(URL, adminId) {
  // console.log("hello===>", URL, adminId);
  return new Promise(async (resolve, reject) => {
    let url = URL + "/products_resto/adminId/" + adminId + `?db=${adminId}`;
    // console.log("hello===>", url);
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
        let result = response.data.products;
        // console.log(result);
        let tab = [];
        if (result.length) {
          result.forEach(async (product) => {
            try {
              let res = await saveProduct(product, URL);
              tab.push(res);
              if (tab.length == result.length) {
                resolve(tab);
              }
            } catch (error) {}
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
module.exports = getProductResto;
