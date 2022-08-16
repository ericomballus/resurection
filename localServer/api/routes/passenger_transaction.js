const express = require("express");
let https = require("https");
const Transaction = require("../models/Passenger_Trasanction");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res, next) => {
  //console.log("ici tenant1", tenant1);   { $set: { name: 'foo' } }
  console.log(req.body);
  try {
    const filter = { _id: req.body._id };
    const update = {
      cash: req.body.cash,
      open: false,
      cashId: req.body.cashId,
    };
    const custumer = await Transaction.findById(filter);
    console.log("hello=========////////////////===");
    console.log(custumer);
    let phone = req.body.customer_phone;
    let montant = req.body.cash;
    let provider = req.body.provider;
    let codeM = "PD216T13636916324029605";
    console.log("montant", montant);
    console.log("tel", phone);
    console.log("code", codeM);
    console.log("provider", provider);
    //PD216T13636916324029605
    let urlDone = `https://www.my-dohone.com/dohone/pay?cmd=start&rDvs=XAF&rMt=${montant}&rMo=${provider}&rT=${phone}&rH=${codeM}&source=maeri`;
    console.log(urlDone);
    /*  https
      .get(urlDone, (res) => {
        console.log("statusCode:", res.statusCode);
        console.log("headers:", res.headers);

        res.on("data", (d) => {
          process.stdout.write(d);
          console.log(d.toString());
          console.log("hello response here in the top");
        });
      })
      .on("error", (e) => {
        console.error(e);
      }); */
    /*let data = {
      applicationCode: "ENEO",
      paymentCode: "MOBILE-MONEY",
      paymentValue: "691660462",
      paymentId: 192,
      amount: "7000",
    }; */
    /* let account = {
      merchantKey: "CONOPSYSTEME",
      secretKey: "000000001BGR",
    };

    axios
      .post("https://testws01.adwapay.com/getADPToken", account)
      // .get(urlDone)
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
      })
      .catch((error) => {
        console.log("==============> error here", error);
        // console.error(error);
      }); */

    var data = `{"merchantKey": "CONOPSYSTEME","secretKey": "000000001BGR","signature": "","application": ""}`;

    var config = {
      method: "post",
      url: "https://testws01.adwapay.com/getADPToken",
      headers: {
        Authorization: "Basic Og==",
        "Content-Type": "text/plain",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        console.log("hello======+++++");
        console.log(response.data);
        let res = response.data;
        let tokenCode = res["data"]["tokenCode"];
        secondTime(axios, tokenCode);
      })
      .catch(function (error) {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:id", async (req, res, next) => {
  let Id = req.params.id;

  try {
    const result = await Transaction.find(Id).lean();
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/all/transaction", async (req, res, next) => {
  try {
    const result = await Transaction.find({})
      // .populate("vendorId")
      .lean()
      .sort({ _id: -1 })
      .limit(100);
    res.status(200).json(result);
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});

router.get("/driver/get/:driverId", async (req, res, next) => {
  let queryCash = req.query.queryCash;
  let result;
  try {
    if (queryCash) {
      console.log(req.params.driverId);
      result = await Transaction.find({
        driverId: req.params.driverId,
        cashId: queryCash,
      })
        // .populate("vendorId")
        .lean()
        .sort({ _id: -1 })
        .limit(100);

      res.status(200).json(result);
    } else {
      result = await Transaction.find({
        driverId: req.params.driverId,
      })

        .lean()
        .sort({ _id: -1 })
        .limit(100);

      res.status(200).json(result);
    }
  } catch (e) {
    console.error(e);
  } finally {
    console.log("We do cleanup here");
  }
});
/*
 let queryCash = req.query.queryCash;
  let result;

  try {
    if (queryCash) {
      result = await Transaction.find({
        cashId: queryCash,
      })
        .lean()
        .sort({ _id: -1 })
        .limit(100);
    } else {
      result = await Transaction.find({})
        // .populate("vendorId")
        .lean()
        .sort({ _id: -1 })
        .limit(100);
      res.status(200).json(result);
    }
    res.status(200).json(result);

*/

router.put("/transaction", async (req, res, next) => {
  //let id = req.body._id;
  console.log(req.body);

  const filter = { _id: req.body._id };
  const update = { qrCode: req.body.qrCode };
  Transaction.findOneAndUpdate(filter, update, {
    new: true,
  })
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res, next) => {
  Transaction.remove({ _id: req.params.id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "role Deleted",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});
let secondTime = (axios, accessToken) => {
  console.log("token: ", accessToken);
  // var data = `  {\r\n    "merchantKey": "CONOPSYSTEME",\r\n    "amount": "100",\r\n    "accessToken": ${accessToken},\r\n      }`;
  var data = `${accessToken}`;
  var config = {
    method: "post",
    url: "https://testws01.adwapay.com/getCommissionByAmount",
    headers: {
      // Authorization: "Basic Og==",
      "Content-Type": "text/plain",
    },
    data: data,
  };
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
module.exports = router;
