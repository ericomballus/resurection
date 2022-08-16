const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;
const usb = require("usb");
//import { getDeviceList } from "usb";

const devices = usb.getDeviceList();

for (const device of devices) {
  console.log(device); // Legacy device
}
