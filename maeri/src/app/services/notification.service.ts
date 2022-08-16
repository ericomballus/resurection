import { Injectable } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Product } from '../models/product.model';
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  isLoading: any;
  constructor(
    private toastController: ToastController,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 5000,
      color: color,
      animated: true,
      position: 'top',
    });
    toast.present();
  }

  async presentError(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 6000,
      position: 'top',
      color: color,
      animated: true,
    });
    toast.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      subHeader: '',
      message: `${msg}`,
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 40000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => {})
      .catch((err) => {});
  }

  async presentFormError(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      position: 'top',
      color: color,
      animated: true,
    });
    toast.present();
  }

  async cancelSale(arr: Product[]) {
    let texte = ` `;
    arr.forEach((prod) => {
      texte = `${texte} 
      ${prod.name},  
      
      `;
    });
    const alert = await this.alertController.create({
      subHeader: 'quantité non disponible',
      message: texte,
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  presentAlertConfirm(msg, yes?, no?) {
    let btnOK = 'YES';
    let btnNo = 'NO';
    if (yes) {
      btnOK = yes;
    }
    if (no) {
      btnNo = no;
    }
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        //  cssClass: 'my-custom-class',
        header: '',
        message: `${msg}`,
        buttons: [
          {
            text: btnNo,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              reject('error');
            },
          },
          {
            text: btnOK,
            handler: () => {
              resolve('ok');
            },
          },
        ],
      });

      await alert.present();
    });
  }

  changePrice() {
    return new Promise(async (resolve, reject) => {
      this.alertController
        .create({
          // cssClass: 'my-custom-class',
          backdropDismiss: false,
          header: '',
          inputs: [
            /* {
            name: 'name4',
            type: 'date',
            min: '2017-03-01',
            max: '2018-01-12',
          },
          {
            name: 'name5',
            type: 'date',
          },*/
            {
              name: 'prix',
              type: 'number',
              placeholder: '1500',
              min: 0,
              max: 10,
            },

            {
              name: 'employe',
              id: 'employe',
              type: 'text',
              placeholder: 'Realisé par ?',
            },
          ],
          buttons: [
            {
              text: 'Annuler',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                reject('aucune action');
              },
            },
            {
              text: 'Ok',
              handler: (alertData) => {
                resolve(alertData);
              },
            },
          ],
        })
        .then((alert) => {
          alert.present();
        });
    });
  }

  typeDePaiement(): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const alert = await this.alertController.create({
        //cssClass: 'my-custom-class',
        header: 'Type de paiement',
        backdropDismiss: false,
        inputs: [
          {
            name: 'Cash',
            type: 'checkbox',
            label: 'Cash',
            value: 'Cash',
            handler: () => {
              console.log('Checkbox 1 selected');
            },
            // checked: true,
          },

          {
            name: 'MTNMoney',
            type: 'checkbox',
            label: 'MTN MONEY',
            value: 'MTN MONEY',
            handler: () => {
              console.log('Checkbox 2 selected');
              // resolve(alertData);
            },
          },

          {
            name: 'OrangeMoney',
            type: 'checkbox',
            label: 'ORANGE MONEY',
            value: 'ORANGE MONEY',
            handler: () => {
              console.log('Checkbox 3 selected');
            },
          },
          {
            name: 'CARD',
            type: 'checkbox',
            label: 'CARTE DE CREDIT',
            value: 'card',
            handler: () => {
              console.log('Checkbox 3 selected');
            },
          },
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
              reject(false);
            },
          },
          {
            text: 'Ok',
            handler: (alertData) => {
              console.log('Confirm Ok');
              resolve(alertData);
            },
          },
        ],
      });

      await alert.present();
    });
  }
}
