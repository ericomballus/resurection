const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Employe = require("../models/Employe");
const User = require("../models/user");
//const findEmploye = require("../../middleware/findemploye");

router.post("/signup/:adminId", async (req, res, next) => {
  console.log(req.body.telephone);
  console.log(req.body);

  Employe.find({ telephone: req.body.telephone })
    .exec()
    .then((docs) => {
      console.log(docs.length);
      if (docs.length >= 1) {
        console.log("existe deja");
        res.status(500).json({
          message: "Number exists",
        });
      } else {
        //console.log("pas la la lalalala");
        bcrypt.hash(req.body.password, 10, (err, password) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              error: err,
            });
          }
          let emp = req.body;
          emp["password"] = password;
          emp["adminId"] = req.params.adminId;

          const employe = new Employe(req.body);
          employe
            .save()
            .then((result) => {
              console.log(result);
              req.io.sockets.emit(`${req.params.adminId}employeAdd`, result);
              res.status(201).json({
                message: "Employe created",
                result: result,
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
  //console.log(req.body);
  let pass = req.body.password;
  console.log(`rien the day of the week =====> ${new Date().getDate()}`);
  Employe.find({ telephone: req.body.telephone })
    .exec()
    .then((employes) => {
      if (employes.length < 1) {
        return res.status(401).json({
          //  message: new Error(`Auth failed, ${req.body.email},is not correct`),
          message2: `Auth failed, ${req.body.telephone},is not correct`,
        });
      } else {
        bcrypt
          .compare(req.body.password, employes[0]["password"])
          .then(async (result) => {
            if (result) {
              let tabRole = [];
              let adminId = employes[0].adminId;

              //tabRole.forEach((r) => console.log(r));
              await require("../../utils/userPaiement")(adminId);
              return res.status(201).json({
                user: employes,
              });
            } else {
              return res.status(500).json({
                error: "phone number exist please use another one",
                message3: `Auth failed password msg 3`,
              });
            }
          });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
        message3: `Auth failed password msg 3`,
      });
    });
  // });
});

router.post("/employe/:id", (req, res, next) => {
  console.log(req.body);
  console.log("eric");
  Employe.find({ _id: req.params.id })
    .exec()
    .then((user) => {
      if (user.length <= 0) {
        return res.status(401).json({
          message: "Auth failed",
        });
      }
      let userId = req.params.id;
      let employe = {
        name: req.body.name,
        password: req.body.password,
        poste: req.body.poste,
        email: req.body.email,
        role: req.body.role,
        telephone: req.body.telephone,
      };

      Employe.findOneAndUpdate(
        { _id: userId },
        { $push: { employes: employe } },
        function (error, success) {
          if (error) {
            console.log(error);
          } else {
            //console.log(success)
            Employe.findOne({ _id: userId }).then((doc) => {
              res.status(201).json({
                message: "ajouté ",
                resultat: doc,
                // professeur: prof
              });
            });
          }
        }
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:adminId", async (req, res, next) => {
  // use lean() to get a plain JS object
  // remove the version key from the response
  /* await mongoose.connect("mongodb://foo:bar@localhost/admin?authSource=admin", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }); */
  console.log(req.params.adminId);

  Employe.find({ adminId: req.params.adminId }, "-v")
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.json({
        employes: result,
      });
    });
});

router.get("/", async (req, res, next) => {
  // use lean() to get a plain JS object
  // remove the version key from the response
  /* await mongoose.connect("mongodb://foo:bar@localhost/admin?authSource=admin", {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }); */
  console.log(req.params.adminId);

  Employe.find({}, "-v")
    .lean()
    .exec((err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }

      res.json({
        employes: result,
      });
    });
});
/*
router.delete("/:id", (req, res, next) => {
  let userid = req.params.id;

  Employe.findByIdAndRemove(userid, (err, user) => {
    if (err && user) {
      return res.sendStatus(400);
    }

    // res.sendStatus(200).json({ message: 'image supprimé avec succé' });
    res.status(200).json({ message: "image supprimé avec succé" });
  });
});
*/
router.delete("/:adminId/delete/:employeId", (req, res, next) => {
  console.log(req.body);

  Employe.remove({ _id: req.params.employeId })
    .then((data) => {
      console.log(data);
      req.io.sockets.emit(
        `${req.params.adminId}employeDelete`,
        req.params.employeId
      );
      res.status(201).json({
        message: "employe delete",
        resultat: data,
        // professeur: prof
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({
        message: "error",
        error: err,
      });
    });
});

router.post("/delete/employe/role/:adminId", (req, res, next) => {
  let userid = req.params.id;
  console.log(req.body);
  Employe.findByIdAndUpdate(
    //{ email: req.body.email },
    { _id: req.body.employeId },
    {
      $pull: { role: { _id: req.body.roleToRemoveId } },
    },
    // { safe: true, upsert: true }
    { new: true }
  )
    .then((data) => {
      req.io.sockets.emit(`${req.params.adminId}employeRoleDelete`, data);
      res.status(201).json({
        message: "ajouté ",
        resultat: data,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: err,
      });
    });
});

router.put("/add/employe/role/:adminId", (req, res, next) => {
  console.log(req.body);

  Employe.findOneAndUpdate(
    //{ email: req.body.email },
    { _id: req.body.employeId },
    {
      $set: { role: req.body.roles },
    },
    { new: true }
    // { safe: true, upsert: true }
  )
    .then((data) => {
      req.io.sockets.emit(`${req.params.adminId}employeRoleAdd`, data);
      res.status(201).json({
        message: "ajouté ",
        resultat: data,
      });
    })
    .catch((err) => {
      return res.status(404).json({
        message: err,
      });
    });
});

router.post("/update/password", async (req, res, next) => {
  console.log(req.body);
  Employe.find({ _id: req.body.id })
    .exec()
    .then((employe) => {
      console.log(employe);

      bcrypt
        .compare(req.body.password, employe[0]["password"])
        .then(function (data) {
          if (data) {
            bcrypt.hash(req.body.newPassWord, 10).then(function (hash) {
              Employe.findByIdAndUpdate(
                //{ email: req.body.email },
                { _id: req.body.id },
                {
                  $set: { password: hash },
                },

                { new: true }
              )
                .then((data) => {
                  // req.io.sockets.emit(`${req.params.adminId}newPassWord`, data);
                  return res.status(201).json({
                    message: "Employe created",
                    result: data,
                  });
                })
                .catch((err) => {
                  return res.status(404).json({
                    message: err,
                  });
                });
            });
          }
        });
      /* .catch(err => {
          console.log(err);
        }); */
    });
});

router.patch("/:adminId", (req, res, next) => {
  //const id = req.body._id;
  // let updateOps = {};
  let productsToSale = [];

  if (req.body.productsToSale && req.body.productsToSale.length) {
    productsToSale = req.body.productsToSale;
  }
  console.log(req.body);
  const employee = {
    telephone: req.body.telephone,
    name: req.body.name,
    poste: req.body.poste,
    productsToSale: productsToSale,
  };

  if (req.body.storeId) {
    employee.storeId = req.body.storeId;
  }
  if (req.body.percentage) {
    employee.percentage = req.body.percentage;
  }
  console.log(employee);
  if (req.body.changepassword) {
    bcrypt.hash(req.body.changepassword, 10).then(function (hash) {
      employee.password = hash;
      Employe.findByIdAndUpdate(
        //{ email: req.body.email },
        { _id: req.body._id },
        { $set: employee },
        { new: true }
      )
        .then((result) => {
          req.io.sockets.emit(`${req.params.adminId}employeRoleAdd`, result);
          res.status(200).json({
            message: "mise a jour",
            resultat: result,
          });
        })
        .catch((err) => {
          return res.status(404).json({
            message: err,
          });
        });
    });
  } else {
    Employe.findByIdAndUpdate(
      { _id: req.body._id },
      { $set: employee },
      { new: true }
    )
      //.exec()
      .then((result) => {
        req.io.sockets.emit(`${req.params.adminId}employeRoleAdd`, result);
        req.io.sockets.emit(`${req.params.adminId}employeAdd`, result);
        res.status(200).json({
          message: "mise a jour",
          resultat: result,
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
