import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
//import { Socket } from "ngx-socket-io";
import { DetailsPage } from '../point-of-sale/details/details.page';
import { ModalController, AlertController, Platform } from '@ionic/angular';
import { TranslateConfigService } from '../translate-config.service';
import { Router } from '@angular/router';
import { UrlService } from '../services/url.service';
import io from 'socket.io-client';
import { RestApiService } from '../services/rest-api.service';
import { InvoicesService } from '../services/invoices.service';
import { LoadingController } from '@ionic/angular';
//import { Events } from "@ionic/angular";
import { HTTP } from '@ionic-native/http/ngx';
import { MyeventsService } from '../services/myevents.service';
import { environment, uri } from '../../environments/environment';
@Component({
  selector: 'app-activitie',
  templateUrl: './activitie.page.html',
  styleUrls: ['./activitie.page.scss'],
})
export class ActivitiePage implements OnInit {
  invoices = [];
  invoices2 = [];
  numPage = 0;
  nbrPages = 0;
  adminId: any;
  total = 0;
  total2 = 0;
  sum = 0;
  isLoading = false;
  cmpt = 0;
  public sockets;
  public url;
  public urlEvent;
  constructor(
    private adminService: AdminService,
    // private socket: Socket,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public router: Router,
    public urlService: UrlService,
    public restApiService: RestApiService, //  public invoiceService: InvoicesService,
    public loadingController: LoadingController,
    public events: MyeventsService,
    private httpN: HTTP,
    public alertController: AlertController,
    private platform: Platform,
    private invoiceService: InvoicesService
  ) {
    this.languageChanged();
    // this.getReadyCommande();

    setTimeout(() => {
      /// this.getReadyCommande();
    }, 1000);
  }

  ngOnInit() {
    this.presentLoading3();
    this.takeUrl();
  }

  ionViewWillEnter() {}
  getInvoicesFromStorage() {
    /* this.events.getInvoices().subscribe((data) => {
      this.getInvoice();
    }); */
  }
  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        // console.log("url", this.url);
      });
    } else {
      this.url = uri;
      console.log(this.url);
    }
    this.urlService.getUrl().subscribe((data) => {
      // this.url = data;
      this.getReadyCommande();
      this.adminId = localStorage.getItem('adminId');
      this.getInvoicesFromStorage();
    });
    this.urlService.getUrlEvent().subscribe((data) => {
      this.urlEvent = data;
    });
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  //updateOrder(order){}
  async getInvoice() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Traitement en cours...',
      duration: 1000,
    });
    await loading.present();
    this.events.storeOrders({}, 'get', []).then((data: Array<any>) => {
      this.invoices = data;
      this.invoices.forEach((order) => {
        let totalPrice = 0;

        order['commandes'].forEach((com) => {
          totalPrice = totalPrice + parseInt(com['cartdetails']['totalPrice']);
        });
        order['totalPrice'] = totalPrice;
      });
      this.invoices = this.invoices.sort((a, b) => {
        return new Date(a.created).getTime() - new Date(b.created).getTime() > 0
          ? -1
          : 1;
      });
      let tab = [];
      tab = this.invoices.filter((elt) => {
        return elt.sale === true;
      });
      tab.forEach((element) => {
        this.total = this.total + element.commande.cartdetails.totalPrice;

        element['commandes'].forEach((com) => {
          this.total = this.total + parseInt(com['cartdetails']['totalPrice']);
        });
      });

      let tab2 = [];
      tab2 = this.invoices.filter((elt) => {
        return elt.sale === false;
      });
      tab2.forEach((element) => {
        element['commandes'].forEach((com) => {
          this.total2 = this.total + parseInt(com['cartdetails']['totalPrice']);
        });
        // this.total2 = this.total2 + element.commande.cartdetails.totalPrice;
      });
      this.sum = this.total + this.total2;
    });

    // this.invoices2 = allCommande;
    // this.invoices = this.invoices.reverse();
    // this.invoices = this.invoices.concat(tab)

    //  this.adminService.getInvoiceByEmployee(1).subscribe(
    //  (data) => {
    //   console.log(data);

    //  if (data && data["docs"]["docs"]) {
    // this.invoices = data["docs"];
    /*  this.numPage = parseInt(data["docs"]["page"]);
          this.nbrPages = data["docs"]["pages"];
          this.invoices = data["docs"]["docs"].reverse();
         
          let tab = [];
          tab = data["docs"]["docs"].filter((elt) => {
            return elt.sale === true;
          });
          tab.forEach((element) => {
            this.total = this.total + element.commande.cartdetails.totalPrice;
          });

          let tab2 = [];
          tab2 = data["docs"]["docs"].filter((elt) => {
            return elt.sale === false;
          });
          tab2.forEach((element) => {
            this.total2 = this.total2 + element.commande.cartdetails.totalPrice;
          });
          this.sum = this.total + this.total2;
        */
    //  }
    /*  },
      (err) => {
        console.log("error here", err);
      }
    ); */
  }
  loadData(event) {
    let num = this.numPage + 1;

    if (num > this.nbrPages) {
      event.target.disabled = true;
      return;
    }
    this.adminService.getInvoiceByEmployee(num).subscribe(
      (data) => {
        event.target.complete();
        console.log(data);
        if (data && data['docs']['docs']) {
          // this.invoices.push(data["docs"]["docs"]);
          this.numPage = parseInt(data['docs']['page']);
          this.nbrPages = data['docs']['pages'];
          let tab = [...this.invoices, ...data['docs']['docs']];
          this.invoices = tab;
          let tabl = [];
          tabl = this.invoices.filter((elt) => {
            return elt.sale === true;
          });
          tabl.forEach((element) => {
            this.total = this.total + element.commande.cartdetails.totalPrice;
          });

          let tab2 = [];
          tab2 = this.invoices.filter((elt) => {
            return elt.sale === false;
          });
          tab2.forEach((element) => {
            this.total2 = this.total2 + element.commande.cartdetails.totalPrice;
          });
          this.sum = this.total + this.total2;
        }
      },
      (err) => {
        console.log('error here', err);
      }
    );
  }
  async serviceConfirm(order) {
    let adminId = localStorage.getItem('adminId');
    let database = localStorage.getItem('adminemail');
    this.presentLoading3();
    let setiing = JSON.parse(localStorage.getItem('setting'));
    if (setiing['use_desktop']) {
      let data = {
        localId: order.localId,
        adminId: adminId,
      };

      let url =
        this.url + `invoice/confirmOders/service?localId=${order.localId}`;
      this.invoiceService.updateInvoice(url, data).subscribe((res) => {
        console.log(res);
        this.dismissLoading();
        order.confirm = true;
        this.events.storeOrders(order, 'patch', this.invoices).then((data) => {
          //this.invoices = data;
          let index = this.invoices.findIndex((elt) => {
            return elt.localId === data['localId'];
          });

          if (index >= 0) {
            this.invoices.splice(index, 1, data);
          }
        });
      });
    } else {
      setTimeout(() => {
        if (order.localId) {
          let data = {
            localId: order.localId,
            adminId: adminId,
          };
          let obj = JSON.stringify(data);
          let url =
            this.url + `invoice/confirmOders/service?localId=${order.localId}`;
          this.httpN.setDataSerializer('utf8');
          this.httpN
            .patch(url, obj, {})
            .then((response) => {
              // alert("confirmation");
              this.dismissLoading();
              order.confirm = true;
              this.events
                .storeOrders(order, 'patch', this.invoices)
                .then((data) => {
                  //this.invoices = data;
                  let index = this.invoices.findIndex((elt) => {
                    return elt.localId === data['localId'];
                  });

                  if (index >= 0) {
                    this.invoices.splice(index, 1, data);
                  }
                });

              let tabRoles = JSON.parse(localStorage.getItem('roles'));
              if (tabRoles.includes(4)) {
              }
            })
            .catch((err) => {
              setTimeout(() => {
                this.serviceConfirm(order);
              }, 3000);
              //alert(JSON.stringify(err));
            });
        } else {
          this.dismissLoading();
        }
      }, 3000);
    }
  }
  orderServicesCancel(order) {
    let adminId = localStorage.getItem('adminId');

    if (order.localId) {
      this.presentLoading3();

      let data = {
        localId: order.localId,
        adminId: adminId,
      };
      let obj = JSON.stringify(data);
      let url =
        this.url +
        `invoice/confirmOders/invoice/cancel?localId=${order.localId}`;
      this.httpN.setDataSerializer('utf8');
      this.httpN
        .patch(url, obj, {})
        .then((response) => {
          // alert("confirmation");
          this.dismissLoading();
          this.invoices = this.invoices.filter((elt) => {
            return elt.localId != order.localId;
          });
          localStorage.setItem(`allCommande`, JSON.stringify(this.invoices));
        })
        .catch((err) => {
          alert('impossible de joindre la caisse');
          //alert(JSON.stringify(err));
        });
    }
  }
  async displayDetails(order) {
    console.log(order);

    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        Pos: true,
      },
      cssClass: 'custom-modal',
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
  webServerSocket(id) {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.sockets = io(this.urlEvent);

    this.sockets.on(`${id}${storeId}buyOrder`, (data) => {
      //  localStorage.setItem("allCommande", JSON.stringify(this.invoices));

      this.events
        .storeOrders(data, 'add', this.invoices)
        .then((res: Array<any>) => {
          this.invoices = res;
        });
      /* let index = this.invoices.findIndex((elt) => {
        return elt.localId === data["localId"];
      });

      if (index >= 0) {
        this.invoices = this.invoices.filter((elt) => {
          return elt.localId !== data["localId"];
        });
        localStorage.setItem("allCommande", JSON.stringify(this.invoices)); 
        let montant = 0;
        let date = Date.now();
        data.commandes.forEach((elt) => {
          elt["products"].forEach((prod) => {
            montant = montant + parseInt(prod.price);
          });
        });
      }
   */

      this.displayAmount();
    });

    this.sockets.on(`${id}invoiceCancel`, (data) => {
      /* this.events
        .storeOrders(data, "cancel", this.invoices)
        .then((data) => {
          console.log(data);
          this.invoices = data;
        })
        .catch((err) => {
          alert(err);
        }); */
    });

    this.sockets.on(`${id}confirmOrder`, (data) => {
      // this.getReadyCommande();
      /* this.events
        .storeOrders(data, "cancel", this.invoices)
        .then((data) => {
          console.log(data);
          this.invoices = data;
        })
        .catch((err) => {
          alert(err);
        }); */
    });
  }

  displayAmount() {
    this.total2 = 0;
    this.sum = 0;
    this.total = 0;
    let tab = [];
    tab = this.invoices.filter((elt) => {
      return elt.sale === true;
    });
    tab.forEach((element) => {
      this.total = this.total + element.commande.cartdetails.totalPrice;
    });

    let tab2 = [];
    tab2 = this.invoices.filter((elt) => {
      return elt.sale === false;
    });
    tab2.forEach((element) => {
      this.total2 = this.total2 + element.commande.cartdetails.totalPrice;
    });
    this.sum = this.total + this.total2;
  }

  async pickInvoice(order) {
    //  console.log(order);
    localStorage.setItem('order', JSON.stringify(order));
    localStorage.setItem('addFlag', JSON.stringify(true));
    /* this.restApiService.saveCart({
      cart: order.commande.cartdetails,
      products: order.commande.products,
    }); */

    this.router.navigateByUrl('shop');
  }

  async updateOrder(order) {
    localStorage.setItem('order_update', JSON.stringify(order));
    localStorage.setItem('old', JSON.stringify(order));
    this.router.navigateByUrl('update-order');
  }
  async presentLoading2() {
    //  this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 2000,
        cssClass: 'my-custom-class',
        message: 'Traitement en cours...',
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

  async presentLoading3() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
        cssClass: 'my-custom-class',
        message: 'Traitement en cours...',
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
  async confirmCancel(order) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Cancel bill?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'OK',
          handler: () => {
            // console.log(this.order);
            // this.ordersCancel(this.order);
            this.orderServicesCancel(order);
          },
        },
      ],
    });

    await alert.present();
  }
  getReadyCommande() {
    /*  let senderId = JSON.parse(localStorage.getItem("user"))["_id"];
    let data = {
      sender: senderId,
    };
    let obj = JSON.stringify(data);
    let url = this.url + `invoice/ready/to/take?localId=${senderId}`;
    this.httpN.setDataSerializer("utf8");
    this.httpN.patch(url, obj, {}).then((res) => {
      alert(JSON.parse(JSON.stringify(res)));
    });
 */
    let setiing = JSON.parse(localStorage.getItem('setting'));
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (
      this.platform.is('desktop') ||
      this.platform.is('electron') ||
      setiing['use_desktop']
    ) {
      console.log('desktop activity');

      this.adminService.getInvoiceNotPaie().subscribe(
        (data: Array<any>) => {
          let id = JSON.parse(localStorage.getItem('user'))['_id'];

          this.dismissLoading();
          this.invoices = data['docs'];
          this.invoices = this.invoices
            .sort((a, b) => {
              return new Date(a.created).getTime() -
                new Date(b.created).getTime() >
                0
                ? -1
                : 1;
            })
            .filter((elt) => {
              return elt.sale === false && elt.senderId == id;
            });

          this.invoices.forEach((element) => {
            let total = 0;
            element['commandes'].forEach((com) => {
              com['products'].forEach((prod) => {
                total = total + prod['price'];
              });
            });
            element['totalPrice'] = total;
          });
          // this.sum = this.total + this.total2;
        },
        (err) => {
          console.log(err);
        }
      );
      return;
    } else if (tabRoles.includes(5)) {
      let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
      let data = {
        sender: senderId,
      };
      let obj = JSON.stringify(data);
      let url = this.url + `invoice/ready/to/take?localId=${senderId}`;
      this.httpN.setDataSerializer('utf8');
      this.httpN
        .patch(url, obj, {})
        .then((response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.invoices = JSON.parse(res['data']);
          // if (this.invoices.length) {
          this.events
            .storeOrders(this.invoices, 'saveAll', this.invoices)
            .then((res) => {});
          //  }
          this.dismissLoading();
          //  this.invoices = JSON.parse(JSON.stringify(response));
          this.invoices = this.invoices.sort((a, b) => {
            return new Date(a.created).getTime() -
              new Date(b.created).getTime() >
              0
              ? -1
              : 1;
          });
          this.invoices.forEach((element) => {
            let total = 0;
            element['commandes'].forEach((com) => {
              com['products'].forEach((prod) => {
                total = total + prod['price'];
              });
            });
            element['totalPrice'] = total;
          });
          //this.sum = this.total + this.total2;
        })
        .catch((err) => {
          this.cmpt = this.cmpt + 1;
          if (this.cmpt === 5) {
            this.dismissLoading();
            // alert(JSON.stringify(err));
            // alert("impossible de joindre la caisse");
          } else {
            setTimeout(() => {
              this.getReadyCommande();
            }, 2000);
          }
        });
    } else {
      let senderId = JSON.parse(localStorage.getItem('user'))['_id'];
      let data = {
        sender: senderId,
      };
      let obj = JSON.stringify(data);
      let uri =
        //"127.0.0.1:3000/" +
        'http://127.0.0.1:3000/';
      let url = uri + `invoice/ready/to/take?localId=${senderId}`;
      this.httpN.setDataSerializer('utf8');
      this.httpN
        .patch(url, obj, {})
        .then((response) => {
          let res = JSON.parse(JSON.stringify(response));
          this.invoices = JSON.parse(res['data']);
          // if (this.invoices.length) {
          this.events
            .storeOrders(this.invoices, 'saveAll', this.invoices)
            .then((res) => {});
          //  }
          this.dismissLoading();
          this.invoices = this.invoices.sort((a, b) => {
            return new Date(a.created).getTime() -
              new Date(b.created).getTime() >
              0
              ? -1
              : 1;
          });
          this.invoices.forEach((element) => {
            let total = 0;
            element['commandes'].forEach((com) => {
              com['products'].forEach((prod) => {
                total = total + prod['price'];
              });
            });
            element['totalPrice'] = total;
          });
          //this.sum = this.total + this.total2;
        })
        .catch((err) => {
          this.cmpt = this.cmpt + 1;
          if (this.cmpt === 5) {
            this.dismissLoading();
            // alert(JSON.stringify(err));
            // alert("impossible de joindre la caisse");
          } else {
            setTimeout(() => {
              this.getReadyCommande();
            }, 2000);
          }
        });
    }
  }
}
