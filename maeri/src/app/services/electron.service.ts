import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  electron: any;
  constructor(private plt: Platform) {
    if (this.plt.is('electron')) {
      (<any>window).require('electron');
    }
  }

  getIpcRenderer() {
    this.electron.ipcRenderer.on('other-custom-signal', (event, arg) => {
      console.log(
        'Received acknowledged from backend about receipt of our signal.'
      );
      console.log(event);
      console.log(arg);
    });

    console.log('Sending message to backend.');
    this.electron.ipcRenderer.send('my-custom-signal', 'hello, are you there?');
  }

  showNotification(msg) {
    this.electron.ipcRenderer.send('show-notification', msg);
  }
}
