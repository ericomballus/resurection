const express = require("express");
const UserRole = require("../models/Roles");
const router = express.Router();
let io = require("socket.io");

router.post("/", (req, res, next) => {
  const role = new UserRole(req.body);
  role.save().then((data) => {
    res.status(201).json({ message: "role add", data: data });
  });
});

router.get("/", (req, res, next) => {
  UserRole.find({}, "-v")
    .lean()
    .exec(async (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      let tabRoles = [];
      if (req.query.adminId) {
        let setting = await require("../../utils/getUserSetting")(
          req.query.adminId,
          req
        );
        if (setting && setting.role == "adminmaeri") {
          tabRoles = result;
        } else {
          result.forEach((r) => {
            if (
              (r.numberId == 6 ||
                r.numberId == 7 ||
                r.numberId == 8 ||
                r.numberId == 9 ||
                r.numberId == 10) &&
              setting[0].refueling_from_warehouse_production
            ) {
              // console.log(r.numberId);

              tabRoles.push(r);
            } else if (
              r.numberId == 2 ||
              r.numberId == 3 ||
              r.numberId == 4 ||
              r.numberId == 5
            ) {
              tabRoles.push(r);
            }
          });
        }

        res.json({
          roles: tabRoles,
        });
      } else {
        res.json({
          roles: result,
        });
      }
    });
});

router.delete("/:id", (req, res, next) => {
  UserRole.remove({ _id: req.params.id })
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

router.patch("/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(req.body);
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  UserRole.update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "role update",
        result: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        error: err,
      });
    });
});

module.exports = router;
