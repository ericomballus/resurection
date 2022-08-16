const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const test = require("../../middleware/multytenant");
const User = require("../models/user");
const findEmploye = require("../../middleware/findemploye");
const QRCode = require("qrcode");
const deleteEmployes = require("../../utils/removeEmployes");
router.post("/signup", async (req, res, next) => {
  User.find({ telephone: req.body.telephone })
    // User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        res.status(500).json({
          message: "Numero de telephone deja utilisé par un autre client",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err,
            });
          }
          const user = new User({
            _iduser: new mongoose.Types.ObjectId(),
            email: req.body.email,
            role: req.body.role,
            telephone: req.body.telephone,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            company: req.body.company,
            city: req.body.city,
            password: hash,
            role: req.body.role,
            venderRole: req.body.userRole,
          });
          user
            .save()
            .then((result) => {
              console.log(result);
              req.io.sockets.emit(`newUser`, result);
              res.status(201).json({
                message: result,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        });
      }
    });
});

router.post("/login", async (req, res, next) => {
  let userdata;
  User.find({ telephone: req.body.telephone })
    .exec()
    .then((user) => {
      console.log(user);
      console.log("user");
      if (user.length < 1) {
        return res.status(401).json({
          //  message: new Error(`Auth failed, ${req.body.email},is not correct`),
          message2: `Auth failed, ${req.body.email},is not correct`,
        });
      }
      userdata = user;

      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(401).json({
            // message: "Auth failed",
            message2: `Auth failed password,is not correct`,
          });
        }
        if (result) {
          return res.status(200).json({
            message: "Auth successful",
            role: "admin",
            //token: token,
            user: userdata,
          });
        }
        //attention l'erreur ce gere ici
        console.log(err);
        /* findEmploye(userdata[0].employes, req, res).then(employee => {
          return res.status(200).json({
            message: "Auth successful",
            role: "employee",
            user: employee[0],
            adminId: userdata[0]["_id"],
            adminEmail: userdata[0]["email"],
            telephone: req.body.telephone
          });
        }); */
        res.status(401).json({
          message2: `Auth failed password,is not correct`,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        message3: `Auth failed password msg 3`,
      });
    });
});

router.post("/login/employee", (req, res, next) => {
  let userdata;
  console.log("erico server");
  // User.find({ email: req.body.email })
  User.find({ telephone: req.body.telephone })

    /* User.find({
    employes: { password: req.body.password }
  }) */
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      console.log(user);
      /* const employe = .filter(
        elt => elt.password === req.body.password
         console.log(employee);
        console.log(user[0]["_id"]);
        console.log(employee[0]);
      );*/
      findEmploye(user[0].employes, req)
        .then((employee) => {
          return res.status(200).json({
            message: "Auth successful",
            role: "employee",
            user: employee[0],
            adminId: user[0]["_id"],
            adminEmail: user[0]["email"],
            telephone: req.body.telephone,
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(401).json({
            error: err,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    });
});

router.post("/employe/:id", (req, res, next) => {
  User.find({ telephone: req.body.telephone })
    // User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      console.log(user.length);
      if (user.length >= 1) {
        console.log("existe deja");
        res.status(500).json({
          message: "Mail exists",
        });
      } else {
        console.log("pas la la lalalala");
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err,
            });
          }
          const user = new User({
            _iduser: new mongoose.Types.ObjectId(),
            email: req.body.email,
            role: req.body.role,
            telephone: req.body.telephone,
            lastName: req.body.lastName,
            firstName: req.body.firstName,
            company: req.body.company,
            city: req.body.city,
            password: hash,
            role: req.body.role,
          });
          user
            .save()
            .then((result) => {
              console.log(result);
              req.io.sockets.emit(`newUser`, result);
              res.status(201).json({
                message: result,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        });
      }
    });
});

router.get("/", (req, res, next) => {
  let tab = [];
  User.find({}, "-v")
    .lean()
    .exec(async (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      for (const user of result) {
        let qrURl =
          req.protocol +
          "://" +
          req.get("host") +
          "/productsitem/" +
          `?db=${user._id}&qrcode=122333`;
        let qrcode = await QRCode.toDataURL(qrURl);

        user["qrcode"] = qrcode;
      }

      res.json({
        users: result,
      });
    });
});

router.get("/:id", async (req, res, next) => {
  User.find({ _id: req.params.id })
    .lean()
    .exec((err, user) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.json(user);
    });
});

router.get("/takeuser/:id", (req, res, next) => {
  console.log(req.params.id);
  User.find({ _id: req.params.id })
    .lean()
    .exec((err, images) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.status(200).json({
        users: images,
        count: images.length,
      });
    });
});
router.get("/takeuser/venderRole/:admindId", (req, res, next) => {
  console.log("log hello vendors query");
  //  console.log(req.params.id);
  User.find({ venderRole: true, autorization: true })
    .lean()
    .exec((err, venders) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.status(200).json(venders);
    });
});

router.delete("/:id", (req, res, next) => {
  let userid = req.params.id;

  User.findByIdAndRemove(userid, (err, user) => {
    if (err && user) {
      return res.sendStatus(400);
    }
    deleteEmployes(userid);
    // res.sendStatus(200).json({ message: 'image supprimé avec succé' });
    res.status(200).json({ message: "image supprimé avec succé" });
  });
});

router.post("/delete/employe/:id", (req, res, next) => {
  let userid = req.params.id;
  console.log(userid);
  // console.log(req.body);
  // console.log(req.body._id);
  /*  User.find({ _id: req.body._id }).then(data => {
    console.log(data);
  });*/
  //User.update(
  User.findOneAndUpdate(
    //{ email: req.body.email },
    { _id: req.params.id },
    {
      $pull: { employes: { _id: req.body._id } },
    },
    { safe: true, upsert: true },
    function (err, node) {
      if (err) {
        return res.status(404).json({
          message: err,
        });
      }
      console.log(node);
      return res.status(200).json({
        message: "ok",
      });
    }
  );
});

router.post("/delete/employe/role/:id", (req, res, next) => {
  let userid = req.params.id;
  console.log(req.body);
  console.log(req.params.id);
  // console.log(req.body._id);
  User.find({ _id: userid }).then((data) => {
    console.log(data.length);
  });
  //User.update(
  User.findOneAndUpdate(
    //{ email: req.body.email },
    { _id: req.params.id },
    {
      $pull: { employes: { _id: req.body._id } },
    },
    { safe: true, upsert: true }
  ).then(() => {
    User.findOneAndUpdate(
      { _id: userid },
      { $push: { employes: req.body } }
    ).then(() => {
      User.findOne({ _id: userid }).then((doc) => {
        res.status(201).json({
          message: "ajouté ",
          resultat: doc,
          // professeur: prof
        });
      });
    });
  });
});
/*
function(err, node) {
      if (err) {
        return res.status(404).json({
          message: err
        });
      }
      User.findOne({ _id: userid }).then(doc => {
        res.status(201).json({
          message: "ajouté ",
          resultat: doc
          // professeur: prof
        });
      });
    }

*/

router.patch("/", (req, res, next) => {
  const id = req.body._id;
  // let updateOps = {};

  /* if (req.body.autorization === "true") {
    req.body.autorization = true;
  } else {
    req.body.autorization = false;
  } */
  console.log(req.body);
  if (req.body.userRole) {
    req.body.venderRole = true;
  }

  if (req.body.newpassword) {
    bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: err,
        });
      } else {
        console.log(hash);
        req.body["password"] = hash;
        delete req.body.newpassword;
        console.log(req.body);
        User.update(
          { _id: id },
          //  { $set: { autorization: req.body.autorization, storeId: req.body.storeId } }
          { $set: req.body }
        )
          .exec()
          .then((result) => {
            req.io.sockets.emit("custumerupdate", req.body);
            res.status(200).json({
              message: "produit mise a jour",
              resultat: req.body,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).json({
              error: err,
            });
          });
      }
    });
  } else {
    User.update(
      { _id: id },
      //  { $set: { autorization: req.body.autorization, storeId: req.body.storeId } }
      { $set: req.body }
    )
      .exec()
      .then((result) => {
        req.io.sockets.emit("custumerupdate", req.body);
        res.status(200).json({
          message: "produit mise a jour",
          resultat: req.body,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          error: err,
        });
      });
  }
});
//});
module.exports = router;
