import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastController, Platform, LoadingController } from '@ionic/angular';
import { WebServer, Response } from '@ionic-native/web-server/ngx';
import { Hotspot, HotspotNetwork } from '@ionic-native/hotspot/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { OfflineManagerService } from './offline-manager.service';
import { UrlService } from './url.service';
import { MyeventsService } from './myevents.service';
import { PrinterService } from './printer.service';
import { from, of, zip, interval } from 'rxjs';
import { AdminService } from './admin.service';
import { NotificationService } from './notification.service';
import { CachingService } from './caching.service';
import { SaverandomService } from './saverandom.service';
//import { setInterval } from "timers";

//import { Events } from "@ionic/angular";
declare var webserver: any;
//import { WebSocketServer } from '@ionic-native/web-socket-server/ngx'
export enum ConnectionStatus {
  Online,
  Offline,
}

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private status: BehaviorSubject<ConnectionStatus> = new BehaviorSubject(
    ConnectionStatus.Offline
  );
  checkNetwork = new BehaviorSubject(true);
  isLoading = false;
  loaderServer: boolean = false;
  longueurLigne = 0;
  grouped: any;
  company: any;
  sum: any;
  montantR = 0;
  reste = 0;
  tabResto = [];
  numF = 1;
  authorisations = true;
  state = false;
  constructor(
    private network: Network,
    private toastController: ToastController,
    private plt: Platform,
    private webServer: WebServer,
    private hotspot: Hotspot,
    private networkInterface: NetworkInterface,
    private offlineManager: OfflineManagerService,
    public loadingController: LoadingController,
    private urlService: UrlService,
    private events: MyeventsService,
    private printService: PrinterService,
    public adminService: AdminService,
    public notif: NotificationService,
    private cacheService: CachingService,
    private saveRandom: SaverandomService,
    private cache: CachingService
  ) {
    this.initializeNetworkEvents();
    if (this.plt.is('android')) {
      this.plt.ready().then(() => {
        let status =
          this.network.type !== 'none'
            ? ConnectionStatus.Online
            : ConnectionStatus.Offline;
        this.status.next(status);
        let tabRoles = JSON.parse(localStorage.getItem('roles'));
        if (tabRoles) {
          if (tabRoles.includes(4)) {
            this.loadLocalServer();
          }
        }
      });
    }
  }
  public initializeNetworkEvents() {
    console.log('start send data herre====>');
    //  this.authorisation = true;
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (tabRoles && tabRoles.length) {
      if (
        tabRoles.includes(4) ||
        tabRoles.includes(8) ||
        tabRoles.includes(9) ||
        tabRoles.includes(10)
      ) {
        console.log('tabrole ok====>', tabRoles);
        this.state = true;
        setInterval(() => {
          console.log('set intervall start hello====>', this.authorisations);
          if (this.authorisations) {
            console.log("je démarre l'envoi des données avec authorisation...");

            this.sendData();
          }
        }, 15000);
      }
    }

    this.network.onDisconnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Online) {
        this.checkNetwork.next(false);
        this.updateNetworkStatus(ConnectionStatus.Offline);

        let tabRoles = JSON.parse(localStorage.getItem('roles'));
        if (!this.isLoading) {
          this.presentLoading();
        }
      }
    });

    this.network.onConnect().subscribe(() => {
      if (this.status.getValue() === ConnectionStatus.Offline) {
        console.log('WE ARE ONLINE');
        this.updateNetworkStatus(ConnectionStatus.Online);

        this.checkNetwork.next(true);

        if (this.isLoading) {
          this.dismissLoading();
        }
        /* this.webServer.stop().then(() => {
          this.notification("local serveur close");
        }); */
      }
    });
  }

  private async updateNetworkStatus(status: ConnectionStatus) {
    this.status.next(status);

    let connection = status == ConnectionStatus.Offline ? 'Offline' : 'Online';
    let toast = this.toastController.create({
      message: `You are now ${connection}`,
      duration: 5000,
      position: 'top',
    });
    toast.then((toast) => toast.present());
  }

  public onNetworkChange(): Observable<ConnectionStatus> {
    return this.status.asObservable();
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
    });
  }

  async loadingLocalDataNotification() {
    /* this.isLoading = true;
    return await this.loadingController.create({
      message: 'Please wait...',
      duration: 1000,
    }); */
  }

  async dismissLoading3() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
  async presentLoading3() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        message: 'Please wait... synchronisation',
        duration: 5000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }

  public getCurrentNetworkStatus(): ConnectionStatus {
    return this.status.getValue();
  }
  async sendData() {
    // this.authorisation = false;
    let cmpt = 0;
    console.log('je send all here', this.authorisations);
    let orders = await this.cache.getCachedRequest('lesCommandes');
    if (orders && orders.length) {
      this.authorisations = false;
      let pro = zip(from(orders), interval(500)).pipe(map(([prod]) => prod));
      pro.subscribe((data: any) => {
        this.offlineManager.sendLocalDataToserver(data).subscribe(
          (res) => {
            //this.removeData(orders, data);
            console.log('response icici', res);
            cmpt = cmpt + 1;
            if (res) {
              this.cache.clearOneCommande(data).then((tab) => {});
            }
            if (cmpt == orders.length) {
              this.authorisations = true;
            }
          },
          (error) => {
            console.log(error);
            cmpt = cmpt + 1;
            if (cmpt == orders.length) {
              this.authorisations = true;
            }
          }
        );
      });
    } else {
      this.authorisations = true;
    }
  }

  removeData(orders, dataTSend) {
    let tab = JSON.parse(localStorage.getItem(`lesCommandes`));
    let tab2 = tab.filter((elt) => {
      return elt['data']['localId'] !== dataTSend['data']['localId'];
    });
    localStorage.setItem(`lesCommandes`, JSON.stringify(tab2));
  }

  loadLocalServer() {
    // this.wsserver.
    this.webServer.onRequest().subscribe(async (data) => {
      let headers = {
        'Content-Type': 'text/html',
        'cache-control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers':
          'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
        'Access-Control-Allow-Methods':
          'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
      };
      //handle post menthod
      if (data.method === 'POST') {
        let path = data.path + '?' + data.query; /*url de requete*/
        let letype = data.method; /*le methode de requete*/
        /*le corps de la requete*/
        let created = Date.now();
        let obj = JSON.parse(data.body);
        // alert("path");
        if (obj['add']) {
          let database = localStorage.getItem('adminemail');

          let path2 = `${data.path}?db=${database}`;
          const res: Response = {
            status: 200,
            body: 'commande',
            headers: {
              'Content-Type': 'text/html',
              'cache-control': 'no-cache',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers':
                'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
              'Access-Control-Allow-Methods':
                'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
            },
          };

          this.addOrder(obj, path2).then((addOrder) => {
            const res: Response = {
              status: 200,
              // body: JSON.stringify({ id: id }),
              body: 'ok ajout reussi',
              headers: headers,
            };
            this.webServer
              .sendResponse(data.requestId, res)
              .catch((error: any) => {
                this.notification(`error ${JSON.stringify(error)}`);
              });
          });
          return;
        }

        if (obj['cancelupdate']) {
          this.cancelAndUpdate(obj).then((result) => {
            const res: Response = {
              status: 200,
              body: 'commande',
              headers: headers,
            };

            this.webServer
              .sendResponse(data.requestId, res)
              .catch((error: any) => {
                this.notification(`error ${JSON.stringify(error)}`);
              });
          });

          return;
        }

        if (!obj['add'] && !obj['check']) {
          let numFacture = localStorage.getItem('numeroFacture');
          if (numFacture) {
            this.numF = parseInt(numFacture) + 1;
            localStorage.setItem('numeroFacture', JSON.stringify(this.numF));
          } else {
            localStorage.setItem('numeroFacture', JSON.stringify(1));
          }
          let total = 0;
          obj['commandes'].forEach((com) => {
            total = total + parseInt(com['cartdetails']['totalPrice']);
          });
          let a = data.query;
          // alert(a);
          obj['created'] = created;
          if (obj['cart']['trancheList']) {
            obj['trancheList'] = obj['cart']['trancheList'];
          }
          if (obj['cart']['consigne']) {
            obj['consigne'] = obj['cart']['consigne'];
          }
          if (obj['storeId']) {
          } else {
            obj['storeId'] = JSON.parse(localStorage.getItem('user'))[
              'storeId'
            ];
          }

          if (obj['Posconfirm']) {
            obj['Posconfirm'] = true;
          } else {
            obj['Posconfirm'] = false;
          }
          if (obj['confirm']) {
            obj['confirm'] = true;
          } else {
            obj['confirm'] = false;
          }
          obj['sale'] = false;
          obj['invoiceCancel'] = false;
          obj['partially'] = false;
          obj['onAccount'] = false;
          obj['cash'] = false;
          obj['totalPrice'] = total;
          obj['avance'] = 0;
          obj['openCashDateId'] = JSON.parse(
            localStorage.getItem('openCashDateObj')
          )['_id'];
          obj['openCashDate'] = localStorage.getItem('openCashDate');
          obj['numFacture'] = this.numF;

          /* if (JSON.parse(localStorage.getItem(`userCommande`))) {
            tab = JSON.parse(localStorage.getItem(`userCommande`));
            obj["numFacture"] = this.numF;
          } else {
            obj["numFacture"] = 1;
          } */
          let commande = JSON.stringify(obj);
          const res: Response = {
            status: 200,
            // body: JSON.stringify({ id: id }),
            body: commande,
            headers: {
              'Content-Type': 'text/html',
              'cache-control': 'no-cache',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers':
                'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
              'Access-Control-Allow-Methods':
                'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
            },
          };
          this.storeCommande(obj);

          // alert(commande);
          this.webServer
            .sendResponse(data.requestId, res)
            .catch((error: any) => {
              this.notification(
                `come from network service error ${JSON.stringify(error)}`
              );
            });
          this.offlineManager
            .localServerMakePost(path, letype, obj)
            .subscribe(async (data) => {
              /* try {
                let order = await this.saveRandom.checkAndBuyinvoice(obj);
                this.events
                  .posStoreOrders(order, 'remove')
                  .then((result) => {});
                this.adminService.buyOrder(order).subscribe((res) => {
                  this.events
                    .posStoreOrders(order, 'remove')
                    .then((result) => {});
                });
              } catch (error) {} */
            });

          return;
        }
      }

      //handle patch method

      if (data.method === 'PATCH') {
        let path = data.path;
        let database = localStorage.getItem('adminemail');
        let adminId = localStorage.getItem('adminId');
        //alert(data.body);
        let path2 = `${data.path}?db=${database}`;

        let localId = data.query.split('=');
        let id = localId[1];

        if (path === '/invoice/confirmOders/service') {
          this.events.posStoreOrders(id, 'patch').then((result) => {
            const res: Response = {
              status: 200,
              // body: JSON.stringify({ id: id }),
              body: 'ok',
              headers: {
                'Content-Type': 'text/html',
                'cache-control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers':
                  'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
                'Access-Control-Allow-Methods':
                  'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
              },
            };
            this.events.serviceConfirmOrder(result);
            let obj = { localId: result['localId'] };
            this.webServer
              .sendResponse(data.requestId, res)
              .catch((error: any) => {
                // alert(JSON.stringify(error));
                this.notification(`error ${JSON.stringify(error)}`);
              });
            this.offlineManager
              .localServerMakePatch(path2, 'patch', obj)
              .subscribe((data) => {
                // console.log("ok");
              });
          });
        } else if (path === '/invoice/ready/to/take') {
          let openCashDateId = JSON.parse(
            localStorage.getItem('openCashDateObj')
          )['_id'];
          let tab = [];
          let tab2 = [];
          tab = await this.cacheService.getCachedRequest('userCommande');
          // tab = JSON.parse(localStorage.getItem(`userCommande`));
          if (tab && tab.length) {
            tab2 = tab.filter((elt) => {
              return (
                elt.senderId === id && elt['openCashDateId'] === openCashDateId
              );
            });

            const res: Response = {
              status: 200,
              // body: JSON.stringify({ id: id }),
              body: JSON.stringify(tab2),
              headers: {
                'Content-Type': 'text/html',
                'cache-control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers':
                  'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
                'Access-Control-Allow-Methods':
                  'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
              },
            };
            // this.events.serviceConfirmOrder(com);
            this.webServer
              .sendResponse(data.requestId, res)
              .catch((error: any) => {
                //alert("error update commande");
              });
          } else {
            const res: Response = {
              status: 200,
              // body: JSON.stringify({ id: id }),
              body: 'rien',
              headers: {
                'Content-Type': 'text/html',
                'cache-control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers':
                  'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
                'Access-Control-Allow-Methods':
                  'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
              },
            };
            this.webServer
              .sendResponse(data.requestId, res)
              .catch((error: any) => {
                //alert("error update commande");
              });
          }
        } else {
          let tab = [];
          let prod;
          let motif = 'service cancel';
          let name;
          // tab = JSON.parse(localStorage.getItem(`userCommande`));
          tab = await this.cacheService.getCachedRequest('userCommande');
          let index = tab.findIndex((elt) => {
            return elt.localId == id;
          });

          if (index >= 0) {
            prod = tab[index]['products'];
            name = tab[index]['userName'];
            if (tab && tab.length) {
              let idl = tab[index]['localId'];
              let obj = {
                localId: id,
                adminId: adminId,
                products: prod,
                motif: motif,
                custumerName: name,
                custumerPhone: '00000000',
              };

              const res: Response = {
                status: 200,
                // body: JSON.stringify({ id: id }),
                body: 'ok',
                headers: {
                  'Content-Type': 'text/html',
                  'cache-control': 'no-cache',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers':
                    'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
                  'Access-Control-Allow-Methods':
                    'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
                },
              };
              // this.events.serviceConfirmOrder(com);
              this.webServer
                .sendResponse(data.requestId, res)
                .catch((error: any) => {
                  //alert("error update commande");
                });
              this.offlineManager
                .localServerCancelOrder(path2, 'patch', obj)
                .subscribe((data) => {});
              this.removeOrder(obj, index);
            }
          } else {
            const res: Response = {
              status: 200,
              // body: JSON.stringify({ id: id }),
              body: 'ok',
              headers: {
                'Content-Type': 'text/html',
                'cache-control': 'no-cache',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers':
                  'Origin, X-Requested-With, Content-Type, mimeType, Accept, Authorization',
                'Access-Control-Allow-Methods':
                  'GET, POST, DELETE, PUT, OPTIONS, TRACE, PATCH, CONNECT',
              },
            };
            this.webServer
              .sendResponse(data.requestId, res)
              .catch((error: any) => {
                //alert("error update commande");
              });
          }
        }
      }
      //handle GET
      if (data.method === 'GET') {
      }
    });

    this.webServer
      .start(3000)
      .then((data) => {
        this.loaderServer = true;
        this.notification('local serveur open on port 3000');
      })
      .catch((error: any) => {
        this.notification(`impossible de demarrer le serveur local ${error}`);
        // alert(JSON.stringify(error));
      });
  }

  stopServer() {
    return new Promise((resolve, reject) => {
      this.webServer
        .stop()
        .then((res) => {
          resolve('webserver close');
        })
        .catch((err) => {
          this.notification(`error ${err}`);
          reject(err);
        });
    });
  }

  notification(texte) {
    let toast = this.toastController.create({
      message: ` ${texte}`,
      duration: 6000,
      position: 'bottom',
    });
    toast.then((toast) => toast.present());
  }
  getInfoHotspot(data) {
    let company = data['company'][0];

    this.networkInterface
      .getWiFiIPAddress()
      .then((address) => {
        //  alert(JSON.stringify(address));
        //
        if (company['ip'] && company['ip'] == address.ip) {
          setTimeout(() => {
            this.notif.presentError(
              `server ip address found ${company['ip']}`,
              'primary'
            );
          }, 10000);
          //je ne fais rien
        } else {
          company['ip'] = address.ip;
          this.adminService.updateCompanySetting(company).subscribe((res) => {
            setTimeout(() => {
              this.notif.presentError(
                `server ip address found ${address.ip}`,
                'primary'
              );
            }, 1500);
          });
        }
      })
      .catch((error) => {
        setTimeout(() => {
          this.notif.presentError(
            'enable to get company ip address please make sur your hotspot device work',
            'danger'
          );
        }, 1500);
      });
  }

  getStatus() {
    return this.status;
  }
  async storeCommande(obj) {
    await this.events.posStoreOrders(obj, 'store').then((res) => {});
    this.events.newOrder(obj);
  }
  addOrder(obj, path2) {
    return new Promise((resolve, reject) => {
      this.events.posStoreOrders(obj, 'add').then((res) => {
        this.events.addToOrder(obj['localId']);
        resolve(obj);

        this.offlineManager
          .localServerMakePatch(path2, 'patch', obj)
          .subscribe((data) => {
            console.log('ok');
          });

        this.printAdd(obj);
      });
    });
  }

  cancelAndUpdate(obj) {
    return new Promise((resolve, reject) => {
      this.events.posStoreOrders(obj, 'maericancelAndUpdate').then((res) => {
        this.events.invoiceUpdateCancel(res);
        this.offlineManager
          .localServerMakePatch(obj['url'], 'patch', obj)
          .subscribe((data) => {
            console.log('ok');
          });

        resolve(obj);
        this.printAdd(res, true);
      });
    });
  }
  removeOrder(obj, index) {
    setTimeout(() => {
      this.events.posStoreOrders(obj, 'remove').then((res) => {
        this.events.invoiceCancel(obj);
      });
    }, 3000);
  }
  stopLocalServer() {
    this.webServer.stop();
  }
  printAdd(data, check?) {
    let tabl = [];
    let tabResto2 = [];
    this.grouped = [];
    data['commande']['products'].forEach((elt) => {
      if (elt.item.productType == 'manufacturedItems') {
        console.log('resto');
      } else {
        tabl.push(elt);
      }
    });
    data['printelt'] = tabl;
    if (tabl.length) {
      if (check) {
        this.PrintBill(data, check);
      } else {
        this.PrintBill(data);
      }
    }

    if (data['commande'] && data['commande']['plat']) {
      tabResto2 = data['commande']['plat'];
      this.grouped = this.groupBy(tabResto2, 'plat');
      setTimeout(() => {
        this.PrintBill2(this.grouped, data['userName'], data['numFacture']);
      }, 1000);
    }
  }

  groupBy(tableauObjets, propriete) {
    return tableauObjets.reduce(function (acc, obj) {
      var cle = obj[propriete];
      if (!acc[cle]) {
        acc[cle] = [];
      }
      acc[cle].push(obj);
      return acc;
    }, {});
  }

  PrintBill(order, modification?) {
    let arr: any = [];
    let montantT = 0;
    order.printelt.forEach((row) => {
      let nameprod = ('' + row.item.name).charAt(0);
      let nameprod2 = ('' + row.item.name).charAt(1);
      let nameprod3 = ('' + row.item.name).charAt(2);
      //  let name = (nameprod + nameprod2 + nameprod3).toUpperCase();
      // console.log(nameprod, "", nameprod2, "", nameprod3);
      let name = row.item.name.toUpperCase();
      if (row.item.modeG) {
        name = name + ' ' + 'GL';
      }

      if (row.item.modeNG) {
        name = name + ' ' + 'NG';
      }

      montantT = montantT + row.price;
      if (name.length < 22) {
        let n = 22 - name.length;
        for (let i = 0; i < n; i++) {
          name = name + ` `;
        }
      }

      if (row.item.modeG) {
        let pv = row.item.sellingPrice.toString();
        let n = 9 - pv.length;
        for (let i = 0; i < n; i++) {
          pv = pv + ` `;
        }

        let a = `${row.item.modeG}   ${name}     ${pv}   ${
          row.item.sellingPrice * row.item.modeG
        }\n`;

        let ligne = '';
        for (let i = 0; i < a.length; i++) {
          ligne = ligne + `-`;
        }
        let s = a + `${ligne}`;
        this.longueurLigne = s.length;
        arr.push(s);
      }

      if (row.item.modeNG) {
        let pv = row.item.sellingPrice.toString();
        let n = 9 - pv.length;
        for (let i = 0; i < n; i++) {
          pv = pv + ` `;
        }

        let a = `${row.item.modeNG}   ${name}     ${pv}   ${
          row.item.sellingPrice * row.item.modeNG
        }\n`;
        let ligne = '';
        for (let i = 0; i < a.length; i++) {
          ligne = ligne + `-`;
        }
        let s = a + `${ligne}`;
        this.longueurLigne = s.length;
        arr.push(s);
      }
      if (!row.item.modeNG && !row.item.modeG) {
        let pv = row.item.sellingPrice.toString();
        let n = 9 - pv.length;
        for (let i = 0; i < n; i++) {
          pv = pv + ` `;
        }

        let a = `${row.qty}   ${name}     ${pv}   ${
          row.item.sellingPrice * row.qty
        }\n`; //4ensuite 15
        let ligne = '';
        for (let i = 0; i < a.length - 1; i++) {
          ligne = ligne + `-`;
        }
        let s = a + `${ligne}`;
        this.longueurLigne = s.length;
        arr.push(s);
      }
    });
    // console.log(arr);
    if (modification) {
      this.makePatch(arr, montantT, order['userName'], order['numFacture']);
    } else {
      this.makePdf(arr, montantT, order['userName'], order['numFacture']);
    }

    let check = localStorage.getItem('printerAutorisation');
  }
  PrintBill2(tab, userName, numFacture) {
    this.company = localStorage.getItem('company');
    let texte = '';
    let text3 = '';
    let company = `${this.company}`.toUpperCase();
    let tableNumber = 0;
    let employe = userName.toUpperCase();
    let total = `${this.sum}`;
    let titre = `                   CUISINE: \n`;
    let texte1 = `     FACTURE: ${numFacture}      ${employe}`;
    let obj = {};
    let texte2 = `${titre} ${texte1}\n` + `===============================\n\n`;
    // console.log(this.grouped);
    let tabResto = [];
    for (const property in this.grouped) {
      // console.log(`${property}: ${this.grouped[property]}`);
      this.grouped[property].forEach((row) => {
        if (obj[`plat${row.plat}`]) {
          let name = row['produit'].name.toUpperCase();
          if (name.length < 40) {
            let n = 40 - name.length;
            for (let i = 0; i < n; i++) {
              name = ` ` + name;
            }
          }
          text3 = text3 + `plat ${row.plat}: ${row.nbr} ${name}\n`;
        } else {
          let name = row['produit'].name.toUpperCase();
          if (name.length < 22) {
            let n = 22 - name.length;
            for (let i = 0; i < n; i++) {
              name = name + ` `;
            }
          }
          text3 = text3 + `${row.nbr} ${name} plat ${row.plat}\n`;
          // obj[`plat${row.plat}`] = 1;
          // tabResto.push(`${row.nbr} ${name} plat ${row.plat}`);
        }
      });
    }

    texte = `${texte2}${text3}`;
    // console.log(texte);

    //
    let check = localStorage.getItem('printerAutorisation');
    if (check === 'yes') {
      this.printService.printText(texte);
    } else {
    }
    this.tabResto = [];
  }

  makePdf(data, sum, userName, numTable) {
    let name = userName.toUpperCase();
    let text1 = `SERVICE: ${name}             AJOUT FACTURE:  ${numTable}\n\n`;
    let text = '';
    data.forEach((elt) => {
      text = text + `${elt}\n`;
    });
    let textFinal = text1 + `${text}`;
    this.printService.printText(textFinal);
  }

  makePatch(data, sum, userName, numTable) {
    let name = userName.toUpperCase();
    let text1 = `SERVICE: ${name}             MODIFICATION FACTURE:  ${numTable}\n\n`;
    let text = '';
    data.forEach((elt) => {
      text = text + `${elt}\n`;
    });
    let textFinal = text1 + `${text}`;
    this.printService.printText(textFinal);
  }
}
