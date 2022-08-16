const {
  app,
  BrowserWindow,
  ipcMain,
  Notification,
  dialog,
} = require("electron");
const url = require("url");
const path = require("path");
var exec = require("child_process").execFile;
//const path = require("path");
function loadServer() {
  /* exec("./server.exe", (err, data) => {
    if (err) {
      console.log(err);
    }
    if (data) {
      console.log("good ==>", data);
    }
  }); */
  new Notification({
    title: "MAERI TEAM",
    body: "WELCOME TO MAERI DESKTOP APP",
  }).show();
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/www/index.html`),
      //pathname: path.join(__dirname, `/src/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );
  // mainWindow.webContents.openDevTools();
  // var arr = mainWindow.webContents.getPrinters();
  // console.log(arr);
  // Open the DevTools.

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}
ipcMain.on("show-notification", (event, arg) => {
  new Notification({
    title: "maeri notification",
    body: arg,
  }).show();
});
ipcMain.on("my-custom-signal", (event, arg) => {
  console.log(
    "Print to the main process terminal (STDOUT) when signal received from renderer process."
  );

  mainWindow.webContents.send(
    "other-custom-signal",
    "message from the backend process"
  );
});
app.on("ready", () => {
  createWindow();
  setTimeout(() => {
    loadServer();
  }, 10000);
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});
