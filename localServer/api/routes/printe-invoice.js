/*const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const fs = require("fs");
const del = require("del");
const path = require("path");

const router = express.Router();
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
let io = require("socket.io");

let UPLOAD_PATH = "invoices";

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});
let upload1 = multer({ storage: storage });

router.post("/", upload1.single("image"), (req, res, next) => {
  res.status(201).json({ message: "ok ok product" });
  let url = path.join(UPLOAD_PATH, req.file.filename);
  let resu = escpos.USB.findPrinter();
  console.log("url printer", url);
  const vid = resu[0].deviceDescriptor.idVendor;
  const pid = resu[0].deviceDescriptor.idProduct;

  const device = new escpos.USB(vid, pid);
  console.log(device);
  device.close();
  const options = { encoding: "GB18030"  };
  // encoding is optional

  const printer = new escpos.Printer(device, options);

  device.open((error) => {
    if (error) {
      console.log("hello error", error);
    } else {
      printer
        .font("a")
        .align("ct")
        .style("bu")
        .size(1, 1)
        .text("The quick brown fox jumps over the lazy dog")
        .size(1, 1)
        .text("hello hello rext")
        .size(1, 1)
      
        .barcode("1234567", "EAN8")
        .table(["One", "Two", "Three"])
        .tableCustom(
          [
            { text: "Left", align: "LEFT", width: 0.2, style: "B" },
            { text: "Center", align: "CENTER", width: 0.2 },
            { text: "Right", align: "RIGHT", width: 0.2 },
          ],
          { encoding: "cp857", size: [1, 1] } // Optional
        );

      printer.qrimage("https://github.com/song940/node-escpos", (error) => {
        printer.cut();
        printer.close();
      });
    }
  });
});

module.exports = router; */
