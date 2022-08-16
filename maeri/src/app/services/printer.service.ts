import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
//import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
import { AlertController, Platform, ToastController } from '@ionic/angular';
//import { BluetoothSerial } from "@ionic-native/bluetooth-serial/ngx";
//import { StarPRNT, Printers } from "@ionic-native/star-prnt/ngx";
//import EscPosEncoder from "esc-pos-encoder-ionic";
import { HttpClient } from '@angular/common/http';
import { environment, uri } from '../../environments/environment';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
//import { File } from '@ionic-native/file';
import { File, Entry } from '@ionic-native/file/ngx';
import { UrlService } from './url.service';
import { HTTP } from '@ionic-native/http/ngx';
import { NotificationService } from './notification.service';
//import { PrintService, UsbDriver, WebPrintDriver } from "ng-thermal-print";
import { Component } from '@angular/core';
import { resolve } from 'dns';
import { RestApiService } from './rest-api.service';
import { SaverandomService } from './saverandom.service';
import { Setting } from '../models/setting.models';
//import { PrintDriver } from "ng-thermal-print/lib/drivers/PrintDriver";
declare var CordovaPrint: any;
declare var cordova: any;
declare var CordovaPrint: any;
export interface dataPrint {
  macAddress: string;
  texte: string;
  idL: string;
}
/*@Plugin({
  pluginName: "calculator",
  plugin: "cordova-plugin-calculator"
}) */
@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  status: boolean = false;

  ip: string = '';
  statutSubject = new BehaviorSubject(false);
  peripheral: any = {};
  statusMessage: string;
  setting: any;
  printer: any;
  url: string = 'http://192.168.100.10:3000/';
  fileTransfer: FileTransferObject;
  storageLocation = '';
  order;
  montantR;
  longueurLigne;
  totalImpaye;
  totalConsigne;
  display = false;
  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    private transfer: FileTransfer,
    private file: File,
    private urlService: UrlService,
    private notif: NotificationService,
    private platform: Platform,
    private resApi: RestApiService,
    private saveRandom: SaverandomService
  ) {
    this.takeUrl();
  }
  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
      });
    } else {
      this.url = uri;
    }
  }
  scan(texte) {
    if (!this.display) {
      cordova.plugins.UsbPrinter.getConnectedPrinters(
        (result) => {
          if (result && result.length) {
            this.notif.presentToast(
              'Printer: connect success: ' + JSON.stringify(result),
              'primary'
            );
            this.printer = result[0];
            this.getPermission();
          }
        },
        (err) => {
          this.notif.presentToast('Printer Not found ! ', 'danger');
        }
      );
    }
  }

  webPrinter(texte) {}

  async scan2(texte, sum, montR, longueurLigne, dette, totalConsigne) {
    cordova.plugins.UsbPrinter.getConnectedPrinters(
      async (result) => {
        if (result) {
          this.printer = result[0];

          this.getPermission2()
            .then(async (res) => {
              this.setting = JSON.parse(localStorage.getItem('setting'));
              let s: Setting = this.saveRandom.getSetting();
              let name = s.name;
              if (s.sale_Gaz) {
                if (this.setting['entete_facture']) {
                  let entete = this.setting['entete_facture'].toUpperCase();
                  name = name + `\n`;
                  let texteF = `${entete}\n`;
                  let t = name.toUpperCase() + texteF + 'AGENCE DE MADAGASCAR';
                  this.monImprimante(t);
                }

                setTimeout(() => {
                  cordova.plugins.UsbPrinter.getConnectedPrinters(
                    (result) => {
                      this.printer = result[0];
                      this.getPermission2().then((result) => {
                        this.Test(
                          texte,
                          sum,
                          montR,
                          longueurLigne,
                          dette,
                          totalConsigne
                        );
                      });
                    },
                    (err) => {
                      alert(JSON.stringify(err));
                    }
                  );
                }, 500);
              } else {
                this.file
                  .readAsArrayBuffer(
                    this.file.externalDataDirectory + 'Download/',
                    'maerilogo.png'
                  )
                  .then((imageBlob) => {
                    let blob = new Blob([imageBlob]);
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      var base64data = reader.result;
                      cordova.plugins.UsbPrinter.add(
                        this.printer.printername,
                        base64data,
                        (result) => {
                          if (this.setting['entete_facture']) {
                            let entete =
                              this.setting['entete_facture'].toUpperCase();
                            let texteF = `${entete}\n`;

                            this.monImprimante(texteF);
                          }

                          setTimeout(() => {
                            cordova.plugins.UsbPrinter.getConnectedPrinters(
                              (result) => {
                                this.printer = result[0];
                                this.getPermission2().then((result) => {
                                  this.Test(
                                    texte,
                                    sum,
                                    montR,
                                    longueurLigne,
                                    dette,
                                    totalConsigne
                                  );
                                });
                              },
                              (err) => {
                                alert(JSON.stringify(err));
                              }
                            );
                          }, 500);
                        },
                        (err) => {
                          alert('Error in usb print action' + err);
                        }
                      );
                    };

                    reader.readAsDataURL(blob);
                  })
                  .catch((err) => {
                    if (this.setting['entete_facture']) {
                      let entete = this.setting['entete_facture'].toUpperCase();
                      let texteF = `${entete}\n`;
                      this.monImprimante(texteF);
                    }

                    setTimeout(() => {
                      cordova.plugins.UsbPrinter.getConnectedPrinters(
                        (result) => {
                          this.printer = result[0];
                          this.getPermission2().then((result) => {
                            this.Test(
                              texte,
                              sum,
                              montR,
                              longueurLigne,
                              dette,
                              totalConsigne
                            );
                          });
                        },
                        (err) => {
                          alert(JSON.stringify(err));
                        }
                      );
                    }, 500);
                  });
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.notif.presentToast('no printer found !!!', 'danger');
        }
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  printReceip(base64data) {
    cordova.plugins.UsbPrinter.add(
      this.printer.printername,
      base64data,
      (result) => {
        this.cutPaper();
      },
      (err) => {
        alert('Error in usb print action' + err);
      }
    );
  }

  printBytes(base64data) {
    cordova.plugins.UsbPrinter.addByteArray(
      this.printer.printername,
      base64data,
      (result) => {
        this.cutPaper();
      },
      (err) => {
        alert('Error in usb print action' + err);
      }
    );
  }
  DisconnectPrinter() {
    return new Promise((resolve, reject) => {
      cordova.plugins.UsbPrinter.disconnect(
        this.printer.this.printer.printername,
        (result) => {
          cordova.plugins.UsbPrinter.getConnectedPrinters(
            (result) => {
              this.printer = result[0];
              resolve('ok');
            },
            (err) => {
              alert(err);
              alert(JSON.stringify(err));
            }
          );
        },
        (err) => {
          alert(err);
          alert(JSON.stringify(err));
        }
      );
    });
  }

  Test(texte, montantT, montR, longueurLigne, dette, totalConsigne) {
    let reste = parseInt(montR) - parseInt(montantT);
    let recap = `   RECU: ${montR} FCFA \n`;
    // let recap = `RECU: ${montR} FCFA   RESTE: ${reste} FCFA \n`;
    // recap = recap + `Total achat: ${montR + reste} FCFA\n`;
    if (totalConsigne) {
      recap = recap + `Montant consigne: ${totalConsigne} FCFA\n`;
    } else {
      totalConsigne = 0;
    }
    if (reste < 0) {
      // reste = -reste;
    }
    let leReste = totalConsigne + montantT - montR;
    if (leReste >= 0) {
    } else {
      leReste = -leReste;
    }
    recap = recap + `Total Facture: ${totalConsigne + montantT} FCFA\n`;
    recap = recap + `RESTE A PAYER: ${leReste} FCFA\n`;
    if (dette) {
      recap = recap + `DETTE: ${dette} FCFA\n`;
    }

    cordova.plugins.UsbPrinter.print(
      this.printer.printername,
      texte,
      (result) => {
        let texte2 = '';
        texte2 = `TOTAL ACHAT: ${montantT} FCFA\n` + `TVA: 0 FCFA`;
        texte2 = texte2 + `\n`;
        let ligne = '';
        for (let i = 0; i < longueurLigne.length; i++) {
          ligne = ligne + `-`;
        }
        let texte3 = texte2 + ligne;
        // let texte2 = `TOTAL: ${montantT} FCFA`;

        cordova.plugins.UsbPrinter.getConnectedPrinters(
          (result) => {
            this.printer = result[0];
            this.getPermission2().then((result) => {
              cordova.plugins.UsbPrinter.printTotal(
                this.printer.printername,
                texte3,
                (result) => {
                  this.monImprimante(recap);
                  let lastL = `CLIENT:                          VENDEUR: \n\n`;
                  this.monImprimante(lastL);
                  this.setting = JSON.parse(localStorage.getItem('setting'));
                  if (this.setting['pied_facture']) {
                    this.monImprimante(this.setting['pied_facture']);
                  }

                  this.cutPaper();
                }
              );
            });
          },
          (err) => {
            alert(JSON.stringify(err));
          }
        );
      },
      (err) => {
        alert('Error in usb print action' + err);
        // failure callback execution
      }
    );
  }

  printText(texte) {
    cordova.plugins.UsbPrinter.getConnectedPrinters(
      (result) => {
        this.printer = result[0];
        this.getPermission2().then((result) => {
          cordova.plugins.UsbPrinter.print(
            this.printer.printername,
            texte,
            (result) => {
              let d = new Date();
              let year = d.getFullYear();
              let month = d.getMonth() + 1;
              let day = d.getDate();
              let heure = d.getHours();
              let minute = d.getMinutes();
              let validUntil = `${year}-${month}-${day} a ${heure}:${minute}`;
              this.monImprimante(validUntil);
              this.cutPaper();
            },
            (err) => {
              alert('Error in usb print action' + err);
            }
          );
        });
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  getPermission2() {
    return new Promise((resolve, reject) => {
      cordova.plugins.UsbPrinter.connect(
        this.printer.printername,
        (result) => {
          // alert(JSON.stringify(result));
          resolve('ok');
        },
        (err) => {
          // use this method to recognise the disconnection of usb device
          alert('error');
          alert(JSON.stringify(err));
          // failure callback execution
        }
      );
    });
  }

  getPermission() {
    cordova.plugins.UsbPrinter.connect(
      this.printer.printername,
      (result) => {
        // alert(JSON.stringify(result));
      },
      (err) => {}
    );
  }
  cutPaper() {
    cordova.plugins.UsbPrinter.cutPaper(
      this.printer.printername,
      (data) => {
        console.log(data);
      },
      (err) => {
        // use this method to recognise the disconnection of usb device
        alert('error');
        alert(JSON.stringify(err));
        // failure callback execution
      }
    );
  }
  async getBase64ImageFromUrl(imageUrl) {
    var res = await fetch(imageUrl);
    var blob = await res.blob();

    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener(
        'load',
        function () {
          resolve(reader.result);
        },
        false
      );

      reader.onerror = () => {
        return reject(this);
      };
      reader.readAsDataURL(blob);
    });
  }
  printerLoop(obj) {
    let tab = JSON.parse(localStorage.getItem(`dataToPrint`));
    let idL =
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5) + 'maeri123print';
    obj['idL'] = idL;
    if (tab && tab.length) {
      tab.push(obj);
    } else {
      let t = [];
      t.push(obj);
      tab = t;
    }
    localStorage.setItem(`dataToPrint`, JSON.stringify(tab));
    /*  if (obj["idL"]) {
    } else {
      
    } */
  }

  async presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.then((toast) => toast.present());
  }

  async presentToast2(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
    });
    toast.then((toast) => toast.present());
  }

  monImprimante(msg) {
    cordova.plugins.UsbPrinter.printTitle(
      this.printer.printername,
      msg,
      (result) => {}
    );
  }

  async download(urlImage) {
    try {
      let verifie = await this.file.checkFile(
        this.file.externalDataDirectory + 'Download/',
        'maerilogo.png'
      );
      let suppression = await this.file.removeFile(
        this.file.externalDataDirectory + 'Download/',
        'maerilogo.png'
      );
    } catch (err) {
      //alert(err);
    }

    let url = urlImage;
    const fileTransfer: FileTransferObject = this.transfer.create();
    fileTransfer
      .download(
        url,
        this.file.externalDataDirectory + 'Download/' + 'maerilogo.png'
      )
      .then(
        async (entry) => {},
        (error) => {}
      );
  }

  checkFileExist(filename) {
    return new Promise((resolve, reject) => {
      this.file
        .checkFile(this.file.externalDataDirectory + 'Download/', filename)
        .then(async (verifie) => {
          if (verifie) {
            resolve(true);
          } else {
            reject(false);
          }
        })
        .catch((err) => {
          reject(false);
        });
    });
  }

  loadUrl(filename) {
    return new Promise((resolve, reject) => {
      this.file
        .readAsDataURL(this.file.externalDataDirectory + 'Download/', filename)
        .then((url) => {
          resolve(url);
        })
        .catch((err) => {
          reject(false);
        });
    });
  }

  async downloadItemsImages(urlImage, filename): Promise<string> {
    let url = urlImage;
    return new Promise(async (resolve, reject) => {
      await this.file
        .checkFile(this.file.externalDataDirectory + 'Download/', filename)
        .then(async (verifie) => {
          if (verifie === true) {
            let URL = await this.file.readAsDataURL(
              this.file.externalDataDirectory + 'Download/',
              filename
            );

            resolve(URL);
          } else if (verifie === false) {
            const fileTransfer: FileTransferObject = this.transfer.create();
            fileTransfer
              .download(
                url,
                this.file.externalDataDirectory + 'Download/' + filename
              )
              .then(
                async (entry) => {
                  let imageBlob = await this.file.readAsDataURL(
                    this.file.externalDataDirectory + 'Download/',
                    filename
                  );

                  resolve(imageBlob);
                },
                (error) => {}
              );
          }
        })
        .catch((err) => {
          const fileTransfer: FileTransferObject = this.transfer.create();
          fileTransfer
            .download(
              url,
              this.file.externalDataDirectory + 'Download/' + filename
            )
            .then(
              async (entry) => {
                let imageBlob = await this.file.readAsDataURL(
                  this.file.externalDataDirectory + 'Download/',
                  filename
                );

                resolve(imageBlob);
              },
              (error) => {}
            );
        });
    });
  }

  printBlob(blob) {
    cordova.plugins.UsbPrinter.getConnectedPrinters(
      async (result) => {
        this.printer = result[0];
        this.getPermission2()
          .then(async (res) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              var base64data = reader.result;
              cordova.plugins.UsbPrinter.addBlob(
                this.printer.printername,
                base64data,
                (result) => {
                  this.cutPaper();
                },
                (err) => {
                  alert('Error in usb print action' + err);
                }
              );
            };

            reader.readAsDataURL(blob);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      (err) => {
        alert(JSON.stringify(err));
      }
    );
  }

  PrintInvoice(
    order,
    order2,
    longueurLigne,
    totalArticleBTL,
    totalArticleCA,
    totalArticle,
    consigneTab,
    totalConsigne,
    totalCassier,
    totalBtl,
    montantR,
    totalImpaye
  ) {
    this.order = order;
    this.montantR = montantR;
    this.totalImpaye = totalImpaye;
    this.totalConsigne = totalConsigne;
    this.longueurLigne = longueurLigne;
    let small = Array(5 + 1).join(' ');
    let arr: any = [];
    let montantT = 0;
    let printerSize = '';
    let bonus = 0;
    if (localStorage.getItem('printerSize')) {
      printerSize = localStorage.getItem('printerSize');
    } else {
      printerSize = 'large';
    }
    let setting = JSON.parse(localStorage.getItem('setting'));

    if (setting['use_bonus']) {
      order.commandes.forEach((com) => {
        com['products'].forEach((prod) => {
          if (prod.item.bonus) {
            bonus = prod.item.bonus + bonus;
          }
        });
      });
    }

    order.commandes.forEach((elt, i) => {
      arr.push(
        /* `               COMMANDE ${i + 1}:  ${
          elt.cartdetails.totalPrice
        }  FCFA\n`*/
        `        COMMANDE ${i + 1}:  ${elt.cartdetails.totalPrice} FCFA\n`
      );
      elt['products'].forEach((row) => {
        let name: string = row.item.name.toUpperCase();
        let originaleName: string = row.item.name.toUpperCase();
        montantT = montantT + row.price;
        // if (name.length < 22 && printerSize == 'large') {

        /* let n = 22 - name.length;
          for (let i = 0; i < n; i++) {
            name = name + ` `;
          }*/
        // } else {

        if (name.length > 10) {
          name = name.slice(0, 9);
        } else {
          let padding = Array(10 - name.length).join(' ');
          name = name + padding;
        }
        if (originaleName.endsWith('VIDE')) {
          //  name = name + ' ' + 'vide';
          name = originaleName;
        }
        if (originaleName.endsWith('ECH')) {
          // name = name + ' ' + 'ECH';
          name = originaleName;
        }
        if (originaleName.endsWith('EMC')) {
          // name = name + ' ' + 'EMC';
          name = originaleName;
        }
        //  }

        if (row.item.modeG) {
          let pv = row.item.sellingPrice.toString();
          let n = 8 - pv.length;
          for (let i = 0; i < n; i++) {
            pv = pv + ` `;
          }

          let a = `${name}   ${row.item.modeG}     ${pv}   ${
            row.item.sellingPrice * row.item.modeG
          }\n`;

          let ligne = '';
          for (let i = 0; i < a.length; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          longueurLigne = s.length;
          arr.push(s);
        }

        if (row.item.modeNG) {
          let pv = row.item.sellingPrice.toString();
          let n = 8 - pv.length;
          for (let i = 0; i < n; i++) {
            pv = pv + ` `;
          }

          let a = `${name}   ${row.item.modeNG}     ${pv}   ${
            row.item.sellingPrice * row.item.modeNG
          }\n`;
          let ligne = '';
          for (let i = 0; i < a.length; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          longueurLigne = s.length;
          arr.push(s);
        }

        if (row.item.BTL) {
          let pv = row.item.sellingPrice.toString();
          let n = 8 - pv.length;
          for (let i = 0; i < n; i++) {
            pv = pv + ` `;
          }

          let a = `${name}   ${row.item.BTL} BTL   ${pv}   ${
            row.item.sellingPrice * row.item.BTL
          }\n`;
          let ligne = '';
          for (let i = 0; i < a.length; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          longueurLigne = s.length;
          arr.push(s);
        }

        if (row.item.CA) {
          let pv = row.item.sellingPackPrice.toString();
          let n = 8 - pv.length;
          for (let i = 0; i < n; i++) {
            pv = pv + ` `;
          }

          let a = `${name}   ${row.item.CA} CA   ${pv}  ${
            row.item.sellingPackPrice * row.item.CA
          }\n`;
          let ligne = '';
          for (let i = 0; i < a.length; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          longueurLigne = s.length;
          arr.push(s);
        }
        if (
          !row.item.modeNG &&
          !row.item.modeG &&
          !row.item.CA &&
          !row.item.BTL
        ) {
          let pv = row.item.sellingPrice.toString();
          let n = 8 - pv.length;
          for (let i = 0; i < n; i++) {
            pv = pv + ` `;
          }

          let a = `${name}  ${row.qty}  ${pv} ${
            row.item.sellingPrice * row.qty
          }\n`; //4ensuite 15
          let ligne = '';
          for (let i = 0; i < a.length - 1; i++) {
            ligne = ligne + `-`;
          }
          // let s = a + `${ligne}`;
          let s = a;
          longueurLigne = s.length;
          arr.push(s);
        }
      });
      if (totalArticleBTL || totalArticleCA) {
        arr.push(`TOTAL COLIS: \n`);
        arr.push(
          `Arti:  ${totalArticle}  ca: ${totalArticleCA}  Btl: ${totalArticleBTL} \n`
        );
      }
      if (order2.trancheList && order2.trancheList.length) {
        // arr.push(`               HISTORIQUE DE PAIEMENT:   \n`);
        arr.push(`  HISTORIQUE DE PAIEMENT:   \n`);
        order2.trancheList.forEach((row) => {
          let today = new Date(row.created);
          let dd = String(today.getDate()).padStart(2, '0');
          let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          let yyyy = today.getFullYear();

          let theDate = dd + '/' + mm + '/' + yyyy;
          let name = row.employeName.toUpperCase();
          if (name.length > 16) {
            name = name.substring(0, 8);
          }
          let pv = row.montant.toString();
          let n = 16 - pv.length;
          for (let i = 0; i < n; i++) {
            // pv = pv + ` `;
          }
          pv = pv + `     `;
          let size = 16 - theDate.length; // espace a ajouter devant la date
          let small = Array(size).join(' ');
          // let name_space = 16 - name.length;
          let name_space = 2;
          let espa = Array(name_space).join(' ');
          let a = `${theDate}${small}${pv}${espa}${name}\n`;
          let ligne = '';
          for (let i = 0; i < a.length - 1; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          longueurLigne = s.length;
          arr.push(a);
        });
      }
      let setting = JSON.parse(localStorage.getItem('setting'));

      if (setting['use_bonus']) {
        let li = `\n`;
        arr.push(li + `             TOTAL SV:  ${bonus} \n`);
      }

      if (consigneTab && consigneTab.length) {
        let totalCa = 0;
        let totalBtl = 0;

        arr.push(`               EMBALLAGES EN CONSIGNES:   \n`);
        arr.push(`ARTICLES                Qté      PU      TOTAL\n`);
        totalConsigne;
        totalCassier;
        totalBtl;
        let a = `Cassier                   ${totalCassier}    ----    ${totalConsigne}\n`;
        let b = `bouteille                  ${totalBtl}    ---    ----\n`;
        let ligne = '';
        for (let i = 0; i < a.length - 1; i++) {
          ligne = ligne + `-`;
        }
        let s = a + `${ligne}`;
        let s1 = b + `${ligne}`;
        arr.push(s);
        arr.push(s1);
        if (totalArticle) {
          let li = `\n`;
          arr.push(
            li + `TOTAL CONSIGNE: ca: ${totalCassier}  Btl: ${totalBtl} \n`
          );
        }
      }
    });

    this.makePdf(arr, montantT, order['userName'], order['numFacture']);

    let check = localStorage.getItem('printerAutorisation');
    if (check === 'yes') {
    } else {
    }
  }

  makePdf(data, sum, userName, numTable) {
    let setting: Setting = this.saveRandom.getSetting();
    let proprio = JSON.parse(localStorage.getItem('credentialAccount'))[
      'users'
    ][0];
    //  let pro = `PROMOTEUR: ${proprio.firstName} ${proprio.lastName}   TEL: ${proprio.telephone}`;
    // let pro = `${setting.name} TEL: ${setting.phoneNumber}`;
    //let pro = `${setting.name} TEL: `;
    let pro = ` `;
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let heure = d.getHours();
    let minute = d.getMinutes();
    let origin = new Date(this.order.created);
    let LADATE = `DATE: ${origin.getDate()}/${
      origin.getMonth() + 1
    }/${origin.getFullYear()}\n`;
    let client = `\n`;
    client = pro + client;
    if (this.order.commande && this.order.commande.customer) {
      client =
        client +
        `CLIENT: ${this.order.commande.customer.name}         TEL: ${this.order.commande.customer.phone}\n`;

      if (this.order.commande.customer.codeClient) {
        client =
          client +
          `CODE CLIENT: ${this.order.commande.customer.codeClient}         \n`;
      }
    }

    let name = userName.toUpperCase();
    let text1 =
      client +
      `SERVICE: ${name}   FACTURE:  ${year}${month}${day}${numTable}\n`;

    let validUntil =
      `Imprimee le: ${day}/${month}/${year}  ${heure}h:${minute}min\n\n`.toUpperCase();
    text1 = text1 + LADATE + validUntil;
    let text = '';
    data.forEach((elt) => {
      text = text + `${elt}`;
    });
    // let textFinal = text1 + `${text} \n`;
    let textFinal = text1 + `${text}`;
    console.log(textFinal);

    if (this.platform.is('electron')) {
      // this.openPDF();
      let texteEntete = '\n';
      let textePiedPage = '\n';
      let setting = JSON.parse(localStorage.getItem('setting')); //pied_facture
      if (setting['entete_facture']) {
        let entete = setting['entete_facture'].toUpperCase();
        texteEntete = `${entete}\n`;
      }
      if (setting['pied_facture']) {
        let piedPage = setting['pied_facture'].toUpperCase();
        textePiedPage = `${piedPage}\n`;
      }
      let data = {
        texteEntete: texteEntete,
        textePiedPage: textePiedPage,
        texte: textFinal,
        sum: sum,
        montantR: this.montantR,
        longueurLigne: this.longueurLigne,
        totalImpaye: this.totalImpaye,
        totalConsigne: this.totalConsigne,
      };
      this.resApi.printInvoice(data).subscribe((res) => {
        console.log(res);
      });
      return;
    }
    if (this.platform.is('android')) {
      this.scan2(
        textFinal,
        sum,
        this.montantR,
        this.longueurLigne,
        this.totalImpaye,
        this.totalConsigne
      );
    }
  }
}
