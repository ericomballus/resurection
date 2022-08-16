const Balance = require("../api/models/Customer_Balance");
//let Customer = require("../api/models/Custumer");
const Contrat = require("../api/models/Contrat_model");
module.exports = (adminId) => {
  return new Promise(async (resolve, reject) => {
    let lejour = new Date().getDate();
    let last = await Contrat.find({ adminId: adminId })
      .sort({ _id: -1 })
      .limit(1);
    let lastDoc = last[0];
    if (lastDoc && lastDoc.created) {
      let lastMonthGenerate = new Date(lastDoc.created).getMonth();
      if (lastMonthGenerate !== new Date().getMonth()) {
        // je genere la facture
        let doc = await GenerateInvoice(adminId);
        resolve(doc);
      } else {
        resolve(true);
      }
    } else {
      let doc = await GenerateInvoice(adminId);
      resolve(doc);
    }
  });
};

function GenerateInvoice(adminId) {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await require("../api/models/user").findById({
        _id: adminId,
      });

      let start = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ).getTime();
      let end = null;
      if (new Date().getMonth() + 1 < 12) {
        end = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 2,
          new Date().getDate()
        ).getTime();
      } else {
        end = new Date(
          new Date().getFullYear() + 1,
          1,
          new Date().getDate()
        ).getTime();
      }
      //   console.log("start ===>", start);

      const contrat = new Contrat({
        startAt: start,
        endAt: end,
        adminId: adminId,
        montant: 5000,
      });
      let doc = await contrat.save();
      // console.log("contrat ===>", doc);
      resolve(user);
    } catch (error) {
      console.log("error here ==>", error);
    }
  });
}
