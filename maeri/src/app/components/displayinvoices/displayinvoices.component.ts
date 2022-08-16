import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { MyeventsService } from 'src/app/services/myevents.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { Router } from '@angular/router';
import { CachingService } from 'src/app/services/caching.service';
import { PrinterService } from 'src/app/services/printer.service';
//import { Events } from "@ionic/angular";
@Component({
  selector: 'app-displayinvoices',
  templateUrl: './displayinvoices.component.html',
  styleUrls: ['./displayinvoices.component.scss'],
})
export class DisplayinvoicesComponent implements OnInit {
  @Input() public orders;
  @Output() sendOrder = new EventEmitter();
  adminId: any;
  public sockets;
  public url;
  appOnline = true;
  userName: any;
  grouped: any;
  company: any;
  constructor(
    private urlService: UrlService,
    public events: MyeventsService,
    public restApiService: RestApiService,
    public router: Router,
    private cache: CachingService,
    private printService: PrinterService
  ) {
    this.adminId = localStorage.getItem('adminId');
    this.userName = JSON.parse(localStorage.getItem('user'))['name'];

    // this.listenEvent();
    this.takeUrl();
  }

  ngOnInit() {
    setTimeout(() => {
      this.orders.forEach((elt) => {
        if (elt['trancheList'] && elt['trancheList'].length) {
          elt['recu'] = 0;
          elt['trancheList'].forEach((t) => {
            elt['recu'] = elt['recu'] + t['montant'];
          });
        }
      });
    }, 1000);
  }

  ngOnChanges(): void {}

  ionViewDidEnter() {
    console.log('hello did enter to component');
  }

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // alert(this.url);
      this.webServerSocket(this.adminId);
    });
  }

  Send(order) {
    this.sendOrder.emit(order);
  }

  webServerSocket(id) {
    this.sockets = io(this.url);

    this.sockets.on(`${id}buyOrder`, (data) => {
      if (this.appOnline) {
        this.orders = this.orders.filter((elt) => {
          return elt._id !== data['_id'];
        });
      }
    });
    this.sockets.on(`${id}deleteOrder`, (data) => {
      if (this.appOnline) {
        this.orders = this.orders.filter((elt) => {
          return elt._id !== data;
        });
      }
    });

    this.sockets.on(`${this.adminId}invoiceCancel`, (data) => {
      if (this.appOnline) {
        this.orders = this.orders.filter((elt) => {
          return elt._id !== data['_id'];
        });
      }
    });
    // check event new line add
    this.sockets.on(`${this.adminId}confirmOrder`, (data) => {
      if (this.appOnline) {
        setTimeout(() => {
          let tab = this.orders.filter((elt) => {
            return elt._id == data._id;
          });
          if (tab.length) {
            console.log('existe');
          } else {
            data.anime = true;
            this.orders.unshift(data);
          }
        }, 1000);
      }
    });

    this.sockets.on(`${id}serviceConfirmOrder`, (data) => {
      if (this.appOnline) {
        setTimeout(() => {
          let index = this.orders.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          if (index >= 0) {
            this.orders.splice(index, 1, data);
          }
        }, 500);
      }
    });

    this.sockets.on(`${id}invoiceadd`, (data) => {
      setTimeout(() => {
        /* let index = this.orders.findIndex((elt) => {
          return elt._id === data["_id"];
        });
        this.orders.splice(index, 1, data); */
      }, 500);
    });
    this.sockets.on(`${id}newOrder`, async (data) => {
      console.log('facture', data);

      let tabResto2 = [];
      if (data['commande'] && data['commande']['plat']) {
        tabResto2 = data['commande']['plat'];
        this.grouped = this.groupBy(tabResto2, 'plat');
        setTimeout(() => {
          this.PrintBill2(this.grouped, data['userName'], data['numFacture']);
        }, 6000);
      }
    });
  }

  listenEvent() {
    this.events.getPublishOrder().subscribe((data) => {
      // alert("display invoices");
      console.log('publish order');
      if (data['localId']) {
        setTimeout(() => {
          let index = this.orders.findIndex((elt) => {
            return elt.localId === data['localId'];
          });

          if (index >= 0) {
            // alert("existe deja");
          } else {
            data.anime = true;
            data['Posconfirm'] = true;
            if (data['userName'] == this.userName) {
              data['sender'] = 'POS';
              // data["confirm"] = true;
            }
            // data.Posconfirm = true;
            this.orders.unshift(data);
            this.events.posStoreOrders(data, 'update').then((res) => {});
          }
        }, 1000);
      }
    });
    this.events.getConfirmOrder().subscribe((data) => {
      // alert("service confirm order");
      console.log('confrim orderst');
      if (data['localId']) {
        let index = this.orders.findIndex((elt) => {
          return elt.localId === data['localId'];
        });
        if (index >= 0) {
          let changes = this.orders[index];
          changes['Posconfirm'] = true;
          changes['confirm'] = true;
          this.orders[index]['Posconfirm'] = true;
          this.orders[index]['confirm'] = true;
          this.orders.splice(index, 1, changes);
        }
      }
    });
    this.events.getInvoiceCancelUpdate().subscribe((data) => {
      console.log('cancel update');
      setTimeout(() => {
        if (data['localId']) {
          let index = this.orders.findIndex((elt) => {
            return elt.localId === data['localId'];
          });
          if (index >= 0) {
            let changes = this.orders[index];

            if (data['commandes']) {
              let total = 0;
              data['commandes'].forEach((com) => {
                com['products'].forEach((prod) => {
                  total = total + prod['price'];
                });
              });
              data['totalPrice'] = total;
              this.orders.splice(index, 1, data);
            }
          }
        }
      }, 1000);
    });

    this.events.getInvoiceCancel().subscribe((data) => {
      console.log('cancel');
      setTimeout(() => {
        if (data['localId']) {
          let index = this.orders.findIndex((elt) => {
            return elt.localId == data['localId'];
          });
          if (index >= 0) {
            this.orders = this.orders.filter((elt) => {
              return elt.localId !== data['localId'];
            });
          }
        }
      }, 1000);
    });

    this.events.getAddOrder().subscribe((id) => {
      console.log('add');
      if (id) {
        setTimeout(() => {
          let index1 = this.orders.findIndex((elt) => {
            return elt.localId === id;
          });
          if (index1 >= 0) {
            let tab;
            // tab = JSON.parse(localStorage.getItem(`userCommande`));
            tab = this.cache.getCachedRequest('userCommande');

            if (tab && tab.length) {
              let index2 = tab.findIndex((elt) => {
                return elt.localId === id;
              });
              // changes["Posconfirm"] = true;
              if (index2 >= 0) {
                let changes = tab[index2];
                let totalPrice = 0;
                changes['commandes'].forEach((com) => {
                  com['products'].forEach((prod) => {
                    totalPrice = totalPrice + prod['price'];
                  });
                });
                changes['totalPrice'] = totalPrice;
                this.orders.splice(index1, 1, changes);
              }
            }
          }
        }, 800);
      }
    });
  }
  add(order) {
    console.log(order);

    this.restApiService.saveCart({
      cart: order.cart,
      products: order.products,
    });
    this.router.navigateByUrl('shop');
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

  PrintBill2(tab, userName, numFacture) {
    this.company = localStorage.getItem('company');
    let texte = '';
    let text3 = '';
    let company = `${this.company}`.toUpperCase();
    let tableNumber = 0;
    let employe = userName.toUpperCase();
    // let total = `${this.sum}`;
    let titre = `                   CUISINE: \n`;
    let texte1 = `     FACTURE: ${numFacture}      ${employe}`;
    let obj = {};
    let texte2 = `${titre} ${texte1}\n` + `===============================\n\n`;
    // console.log(this.grouped);
    let tabResto = [];
    for (const property in this.grouped) {
      // console.log(`${property}: ${this.grouped[property]}`);
      this.grouped[property].forEach((row) => {
        if (parseInt(row.nbr)) {
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
        }
      });
    }

    texte = `${texte2}${text3}`;
    this.printService.printText(texte);
    //
    let check = localStorage.getItem('printerAutorisation');
    if (check && check === 'yes') {
      setTimeout(() => {
        // this.printService.printText(texte);
      }, 5000);
    } else {
    }
  }
}
