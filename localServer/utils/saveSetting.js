const companySchema = require("../api/models/Company_Setting");
const axios = require("axios");
const ImagesStore = require("../api/models/ImagesStore");
const mongoose = require("mongoose");
var path = require("path");
const fs = require("fs");
let http = require("http");
let Stream = require("stream").Transform;
const dbl = "customerDb";
const tenant = require("../getTenant");

function saveCompany(company) {
  return new Promise(async (resolve, reject) => {
    const dir = "./localimages2";
    if (company["logo"] && company["logo"].length) {
      let filename = company._id;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir); //creating folder
      }
      let url = company.logo;
      const writeStream = fs.createWriteStream(dir + "/" + filename);
      http
        .request(url, (response) => {
          let data = new Stream();
          response.on("data", (chunk) => {
            data.push(chunk);
          });
          response.on("end", () => {
            fs.writeFileSync("./localimages2/" + "logo", data.read());
          });
        })
        .on("error", (err) => {
          console.log(
            "il ya erreur impossible de telecharger le logo====>",
            err
          );
          reject(err);
        })
        .end(() => {
          const Image = new ImagesStore({
            _id: new mongoose.Types.ObjectId(),
            adminId: company.adminId,
            filename: filename,
            originalname: filename,
          });
          Image.save().then(async (data) => {
            let url = `http://127.0.0.1:3030/images/${data._id}`;
            company["logo"] = url;
            let database = await tenant.getModelByTenant(
              dbl,
              "company",
              companySchema
            );

            database
              .find({ _id: company._id })
              .lean()
              .exec((err, comp) => {
                if (comp && comp.length) {
                  // reject("existe");
                  database
                    .findOneAndUpdate(
                      { _id: company._id },
                      { $set: company },
                      { new: true }
                    )
                    .exec()
                    .then((result) => {
                      // console.log("product update here===>", result);
                      resolve(result);
                    });
                } else {
                  //
                  database.create(company).then(async (resultat) => {
                    resolve(resultat);
                  });
                }
              });
          });
        });
    } else {
      let database = await tenant.getModelByTenant(
        dbl,
        "company",
        companySchema
      );

      database
        .find({ _id: company._id })
        .lean()
        .exec((err, comp) => {
          if (comp && comp.length) {
            // reject("existe");
            database
              .findOneAndUpdate(
                { _id: company._id },
                { $set: company },
                { new: true }
              )
              .exec()
              .then((result) => {
                // console.log("product update here===>", result);
                resolve(result);
              });
          } else {
            //
            database.create(company).then(async (resultat) => {
              resolve(resultat);
            });
          }
        });
    }
  });
}
function getCompany(adminId, URL) {
  return new Promise(async (resolve, reject) => {
    let url = URL + "/company/" + adminId + `?db=${adminId}`;
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
      .then(async (response) => {
        let result = response.data.company;

        // resolve(response.data.docs);
        // console.log("voici les packs", result);
        let company = result[0];

        saveCompany(company)
          .then((res) => {
            resolve(res);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch(function (error) {
        // console.log(error);
        reject(error);
      });
  });
}

module.exports = getCompany;
