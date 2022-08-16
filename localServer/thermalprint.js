const express = require("express");
const multer = require("multer");
let path = require("path");
const fs = require("fs");
let usb = require("usb");
const router = express.Router();
const escpos = require("escpos");
escpos.USB = require("escpos-usb");
console.log("========thermal print start");
//const path = require("path");
const options = { encoding: "GB18030" };
let found = escpos.USB.findPrinter();
let vid = null;
let pid = null;
let device = null;
let printer = null;
if (found && found.length) {
  vid = found[0].deviceDescriptor.idVendor;
  pid = found[0].deviceDescriptor.idProduct;
  device = new escpos.USB(vid, pid);
  // console.log(device);
  printer = new escpos.Printer(device, options);
} else {
  console.log("========rien");
  /* let list = usb.usb.();
  console.log("========", list);
  let device1 = list[1];
  vid = device1.deviceDescriptor.idVendor;
  pid = device1.deviceDescriptor.idProduct;
  device = new escpos.USB(vid, pid);
  console.log(device);
  printer = new escpos.Printer(device, options);
  setTimeout(() => {
    testePrinter();
  }, 2500);*/
  usb.usb.on("attach", (device1) => {
    console.log("usb attach printer==========");
    console.log(device1);
    vid = device1.deviceDescriptor.idVendor;
    pid = device1.deviceDescriptor.idProduct;
    device = new escpos.USB(vid, pid);
    console.log(device);
    printer = new escpos.Printer(device, options);
    setTimeout(() => {
      //  testePrinter();
    }, 2500);
    // console.log(found);
  });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },

  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});
var upload = multer({ storage: storage });
router.get("/", (req, resp, next) => {
  let url = path.join("images", "my-image-file-name.jpeg");
  if (device) {
    device.open((err) => {
      if (err) {
        console.log(err);
      }
      printer
        .align("ct")
        .font("a")
        .align("ct")
        .style("small")
        .size(0, 0)
        .text("Hello World")
        .drawLine()
        .text("")
        .size(1, 0)
        .text("large")
        .text("mballus")
        .size(0, 1)
        .text("node js javascript")
        .size(1, 1)
        .text("angular")
        .font("a")
        .align("lt")
        .style("normal")
        .text("2018/02/17 00:00")
        .cut()
        .close();
      // .image(image, "s8")
      // .then(() =>
      //  printer
      /* .font("a")
            .align("ct")
            .style("small")
            .size(1, 1)
            .text("Hello World")
            .drawLine()
            .text("")
            .size(2, 2)
            .text("large")
            .text("mballus")
            .size(2, 1)
            .text("node js javascript")
            .size(1, 1)
            .text("angular")
            .font("a")
            .align("lt")
            .style("normal")
            .text("2018/02/17 00:00")
            .cut()
            .close()*/
      // );
    });
  }

  // });

  /* device.open((error) => {
    if (error) {
      console.log("hello error", error);
    } else {
      printer
        .font("a")
        .align("ct")
        .style("small")
        .size(1, 1)
        .text("Hello World")
        .drawLine()
        .text("")
        .size(2, 2)
        .text("large")
        .text("mballus")
        .size(2, 1)
        .text("node js javascript")
        .size(1, 1)
        .text("angular")
        .font("a")
        .align("lt")
        .style("normal")
        .text("2018/02/17 00:00")
        .cut()
        .close();
    }
  }); */
});

router.post("/", upload.single("image"), async (req, res) => {
  fs.rename(req.file.path, "./uploads/erico.png", (err) => {
    if (err) {
      console.log(err);
    } else {
      /* sharp(__dirname + "/uploads/erico.png")
        .resize({ width: 302, height: 295, fit: "fill" })
        .png()
        .toFile(__dirname + "/uploads/maeri.png")
        .then((data) => {
          escpos.Image.load("./uploads/maeri.png", (image) => {
            // console.log(image);
            device.open((err) => {
              if (err) {
                console.log(err);
              }
              printer
                .align("ct")
                .image(image, "s8")
                // image(image, "d8")
                //  .image(image, "s24")
                .then(() => printer.cut().close());
            });
          });
        });
        */
    }
  });

  //  res.send({ some: "json" });
});

router.post("/invoice", async (req, res) => {
  console.log(req.body);
  res.send({ some: "json" });

  let texte = req.body.texte.toLowerCase();
  let company = req.body.company;
  const logo = "./localimages2/" + "logo";
  if (device) {
    if (fs.existsSync(logo)) {
      let url = `http://127.0.0.1:3030/image?filename=logo`;

      escpos.Image.load(url, (image) => {
        // console.log(image);
        console.log("le logo ici===>", image);
        // if (device && device.open) {
        device.open((err) => {
          if (err) {
            console.log(err);
          } else {
            printer
              .size(0, 0)
              .align("ct")
              .style("small")
              // .image(image, "s8")
              .image(image, "d24")
              .then(() => {
                printer
                  .align("ct")
                  .style("normal")
                  .size(0, 1)
                  .text(company)
                  .text("")
                  .align("ct")
                  .font("a")
                  .align("ct")
                  .style("small")
                  .size(0, 0)
                  .text(texte)
                  .size(0, 0)
                  .align("lt")
                  .style("small")
                  .text(" ")
                  .cut()
                  .close();
              });
            /* .align("ct")
                .style("normal")
                .size(0, 1)
                .text(company)
                .text("")
                .align("ct")
                .font("a")
                .align("ct")
                .style("small")
                .size(0, 0)
                .text(texte)
                .size(0, 0)
                .align("lt")
                .style("small")
                .text("Maeri POS Made By Conops")
                .cut()
                .close();*/
          }

          // image(image, "d8")
          //  .image(image, "s24")
          // .then(() => printer.cut().close());
        });
      });
    } else {
      device.open((err) => {
        if (err) {
          console.log(err);
        }
        printer
          .align("ct")
          .font("a")
          .align("ct")
          .style("normal")
          .size(0, 1)
          .text(company)
          .text("")
          .align("ct")
          .font("a")
          .align("lt")
          .style("small")
          .size(0, 0)
          .style("small")
          .size(0, 0)
          .text(texte)
          .align("ct")
          .style("small")
          .size(0, 0)
          .text("  ")
          .align("ct")
          .style("small")
          .size(0, 0)
          .text("  ")
          .align("ct")
          .style("small")
          .size(0, 0)
          .text("  ")
          .cut()
          .close();
      });
    }
  }
});

module.exports = router;

function testePrinter() {
  console.log("hello");
  device.open((err) => {
    if (err) {
      console.log(err);
    }
    printer
      .align("ct")
      .font("a")
      .align("ct")
      .style("normal")
      .size(0, 1)
      .text("company maeri")
      .text("")
      .align("ct")
      .font("a")
      .align("ct")
      .style("small")
      .size(0, 0)
      .style("small")
      .size(0, 0)
      .text(
        `hello printer walk very well maeri is new app --------------------
      allow you to control your businnes very easy
      --------------------------------------------------------------
      went every things happens in the warehouse or in the store maeri send you notification
      --------------------------------------------------------------`
      )
      .size(0, 0)
      .align("lt")
      .style("small")
      .text("Maeri POS Made By Conops")
      .cut()
      .close();
  });
}
