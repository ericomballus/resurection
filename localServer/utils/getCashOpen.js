const StorageModel = require("../api/models/Storage");
const tenant = require("../getTenant");
const dbl = "customerDb";
const axios = require("axios");
const getOpenId = async (req) => {
  return new Promise((resolve, reject) => {
    // let URL = "http://18.157.225.135:3000" + req.url;
    // let URI = "http://18.157.225.135:3000";
    //  let URL = "http://localhost:3000" + req.url;  172.20.10.4
    //let URI = "http://localhost:3000" + URL;
    // let URI = "http://18.157.225.135:3000" + URL;
    let adminId = req.params.adminId;
    let storeId = req.query.storeId;
    let url =
      "http://18.157.225.135:3000" +
      `/cashOpen/${adminId}?db=${adminId}&storeId=${storeId}`;
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
        console.log(
          "===========================voici le cash open ici========================="
        );

        console.log(response.data);
        resolve(response.data);
      })
      .catch(async (error) => {});
  });
};

module.exports = getOpenId;
