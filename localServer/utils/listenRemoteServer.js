const serviceSchema = require("../api/models/Billard");
const getSetting = require("../utils/saveSetting");
const getInvoices = require("../utils/saveInvoices");
const getBills = require("../utils/saveBills");
const tenant = require("../getTenant");
const dbl = "customerDb";
class ListenRemoteServer {
  constructor() {
    this.avaible = false;
    this.storeId = "erico";
    this.URI = null;
    this.io = null;
    this.isListen = false;
    if (ListenRemoteServer.instance == null) {
      ListenRemoteServer.instance = this;
    }
    // this.URI = URI;
    return ListenRemoteServer.instance;
  }
  start(adminId, URI) {
    console.log("start socket io client here ===>", adminId);
    console.log("Remote server url found ===>", URI);
    this.URI = URI;
    let socketClient = require("socket.io-client")(URI, {
      reconnect: true,
    });

    socketClient.on("connect", () => {
      this.isListen = true;
      console.log(
        "je suis connecté socket depuis le serveur local",
        socketClient.id
      );
    });
    socketClient.on("mballus", (data) => {
      console.log("mballus events here====>", data);
    });

    socketClient.on(`${adminId}billardItem`, (data) => {
      console.log(data);
    });
    socketClient.on(`${adminId}${this.storeId}billardItem`, async (data) => {
      console.log(data);
      io.sockets.emit(`${adminId}${this.storeId}billardItem`, data);
      let database = await tenant.getModelByTenant(
        dbl,
        "billard",
        serviceSchema
      );
      const filter = { _id: data_id };
      const update = data;
      console.log(update);
      try {
        let result = await database.findOneAndUpdate(
          filter,
          { $set: update },
          { new: true }
        );
        console.log(result);
      } catch (e) {
        console.error(e);
      }
    });

    socketClient.on(
      `${adminId}${this.storeId}billardItemRestore`,
      async (data) => {
        console.log(data);
        io.sockets.emit(`${adminId}${this.storeId}billardItem`, data);
        let database = await tenant.getModelByTenant(
          dbl,
          "billard",
          serviceSchema
        );
        const filter = { _id: data_id };
        const update = data;
        console.log(update);
        try {
          let result = await database.findOneAndUpdate(
            filter,
            { $set: update },
            { new: true }
          );
          console.log(result);
        } catch (e) {
          console.error(e);
        }
      }
    );
    socketClient.on(`${adminId}${this.storeId}newSetting`, (data) => {
      getSetting().then(() => {
        io.sockets.emit(`${adminId}newSetting`, data);
      });
    });

    socketClient.on(`${adminId}${this.storeId}newOrder`, async (data) => {
      console.log(data);
    });
    socketClient.on(`${adminId}${this.storeId}billCancel`, async (data) => {
      console.log(data);
      await getInvoices(this.URI, adminId, data.openCashDateId);
      await getBills(this.URI, adminId, data.openCashDateId);
    });
  }

  setStoreId(id) {
    this.storeId = id;
  }

  setStoreId2(id) {
    return new Promise((resolve, reject) => {
      this.storeId = id;
      resolve(this.storeId);
    });
  }
  setSocket(io) {
    this.io = io;
  }

  setIsListen(v) {
    this.isListen = v;
  }
  reloadStart(adminId, URI) {
    return new Promise((resolve, reject) => {
      // this.storeId = storeId;
      //this.adminId = adminId;
      //  this.start(adminId, URI);
      resolve(true);
    });
  }
}

const listenRemoteServer = new ListenRemoteServer();

module.exports = listenRemoteServer;
