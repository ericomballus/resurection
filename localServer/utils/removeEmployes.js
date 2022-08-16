const Employe = require("../api/models/Employe");

const deleteEmploye = (adminId) => {
  Employe.find({ adminId: adminId })
    .then((docs) => {
      console.log(docs);
      if (docs.length) {
        docs.forEach((emp) => {
          Employe.findByIdAndRemove(emp._id, (err, res) => {
            if (err) {
              console.log("error  ====>", err);
            }
            console.log("employe remove", res);
          });
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = deleteEmploye;
