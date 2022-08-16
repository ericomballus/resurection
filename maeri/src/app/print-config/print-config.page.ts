import { Component } from '@angular/core';
import { PrinterService } from '../services/printer.service';
//import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
@Component({
  selector: 'app-print-config',
  templateUrl: './print-config.page.html',
  styleUrls: ['./print-config.page.scss'],
})
export class PrintConfigPage {
  bluetoothList: any = [];
  selectedPrinter: any = '0000';
  devices: any[] = [];
  loadPrinter: Boolean = false;
  auth = { autorise: false };
  timeToLeave = 10;
  constructor(
    private print: PrinterService // private btSerial: BluetoothSerial
  ) {
    if (localStorage.getItem('printer')) {
      this.selectedPrinter = localStorage.getItem('printer');
    } else {
    }

    let check = localStorage.getItem('printerAutorisation');
    if (check === 'yes') {
      this.auth.autorise = true;
    } else {
      // this.auth = false;
      this.auth.autorise = false;
    }
    if (localStorage.getItem('timeToLeave')) {
      this.timeToLeave = JSON.parse(localStorage.getItem('timeToLeave'));
    }
  }
  ngOnInit() {}
  //This will list all of your bluetooth devices
  saveTime() {
    console.log(this.timeToLeave);
    if (this.timeToLeave > 300) {
      alert('time must not be exceeded 300 secondes');
      return;
    } else {
      localStorage.setItem('timeToLeave', JSON.stringify(this.timeToLeave));
    }
  }
  scan() {}
  enablePrinter() {
    this.loadPrinter = !this.loadPrinter;
    console.log(this.loadPrinter);
    if (this.loadPrinter) {
      localStorage.setItem('printerAutorisation', 'yes');
      this.auth.autorise = true;
    } else {
      localStorage.setItem('printerAutorisation', 'no');
      this.auth.autorise = false;
    }
  }
  selectPrinter(Macaddress) {
    //Selected printer macAddress stored here
    this.selectedPrinter = Macaddress;
    localStorage.setItem('printer', Macaddress);
    this.connectToBluetoothPrinter(Macaddress);
    alert('printer ID save');
  }

  enableBluetooth() {}
  searchBluetoothPrinter() {}

  connectToBluetoothPrinter(macAddress) {}
  disconnectBluetoothPrinter() {
    //This will disconnect the current bluetooth connection
  }

  thermalPrinter(ev: Event) {
    localStorage.setItem('printerSize', ev.target['value']);
  }
}
