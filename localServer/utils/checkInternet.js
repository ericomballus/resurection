const ping = require("ping");

class CheckInternetConnection {
  constructor() {
    this.avaible = false;
    if (CheckInternetConnection.instance == null) {
      CheckInternetConnection.instance = this;
    }
    // this.URI = URI;
    return CheckInternetConnection.instance;
  }
  ping() {
    setInterval(() => {
      let status = makePing();

      status.then((res) => {
        //console.log(res);
        if (res) {
          this.avaible = res;
          /*  setTimeout(() => {
            console.log("internet connection found, remote server avaible...");
          }, 1500);*/
        } else {
          this.avaible = false;
          /* setTimeout(() => {
            console.log(
              "no internet connection, remote server is not avaible....."
            );
          }, 1500);*/
        }
      });
    }, 200);
  }
}

const checkInternetConnection = new CheckInternetConnection();

async function makePing() {
  const result = await ping.promise.probe(
    "https://warm-caverns-20968.herokuapp.com"
  );
  //const result = await ping.promise.probe("18.157.225.135");
  //const result = await ping.promise.probe("127.0.0.1");
  return result.alive;
}

module.exports = checkInternetConnection;
