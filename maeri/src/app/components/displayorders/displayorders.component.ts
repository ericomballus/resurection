import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { OrderDetailsPage } from 'src/app/order-details/order-details.page';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { PrinterService } from 'src/app/services/printer.service';
import { MyeventsService } from 'src/app/services/myevents.service';
import { HttpClient } from '@angular/common/http';
import { CachingService } from 'src/app/services/caching.service';
import { RestApiService } from 'src/app/services/rest-api.service';

//import { Events } from "@ionic/angular";
@Component({
  selector: 'app-displayorders',
  templateUrl: './displayorders.component.html',
  styleUrls: ['./displayorders.component.scss'],
})
export class DisplayordersComponent implements OnInit {
  @ViewChildren('itemlist', { read: ElementRef }) items: any;
  @Input() public notifications;
  @Output() valueChange = new EventEmitter();
  sum: any;
  montantR = 0;
  reste = 0;
  public sockets;
  adminId: any;
  public url;
  company: any;
  tabResto = [];
  grouped: any;
  appOnline = false;
  pdfObj = null;
  longueurLigne = 0;
  timeTL = 30;
  totalArticleBTL = 0;
  totalArticleCA = 0;
  totalArticle = 0;
  consigneTab: any;
  totalConsigne: any;
  totalCassier = 0;
  totalBtl = 0;
  totalImpaye = 0;
  constructor(
    public modalController: ModalController,
    private urlService: UrlService,
    private printService: PrinterService,
    public events: MyeventsService,
    private http: HttpClient,
    private cache: CachingService,
    private resApi: RestApiService,
    private platform: Platform
  ) {
    //console.log(this.notifications);
    this.adminId = localStorage.getItem('adminId');

    this.takeUrl();
    this.events.getNewOrder().subscribe((data) => {
      console.log('data here==>', data);
      if (data && data['Posconfirm']) {
      } else {
        let timetl = JSON.parse(localStorage.getItem('timeToLeave'));
        let check = localStorage.getItem('printerAutorisation');
        let valid = false;
        if (check === 'yes') {
          valid = true;
        }
        if (timetl) {
          this.timeTL = timetl;
        }
        if (data && data['localId']) {
          if (this.timeTL && valid) {
            let timeTL = JSON.parse(localStorage.getItem('timeToLeave'));
            setTimeout(() => {
              let index = this.notifications.findIndex((elt) => {
                return elt.localId === data['localId'];
              });
              if (index >= 0) {
                this.Send(data);
              }
            }, timeTL * 1000);
          }
          this.localServer(data);
        }
      }
    });

    this.events.getConfirmOrder().subscribe((data) => {
      if (data['localId']) {
        let index = this.notifications.findIndex((elt) => {
          return elt.localId === data['localId'];
        });
        if (index >= 0) {
          let changes = this.notifications[index];
          // changes["Posconfirm"] = true;
          changes['confirm'] = true;
          this.notifications[index]['confirm'] = true;
          this.notifications.splice(index, 1, changes);
        }
      }
    });

    this.events.getInvoiceCancelUpdate().subscribe((data) => {
      if (data['localId']) {
        let index = this.notifications.findIndex((elt) => {
          return elt.localId === data['localId'];
        });
        if (index >= 0) {
          // let changes = this.notifications[index];
          //  changes["commandes"] = data["commandes"];
          this.notifications.splice(index, 1, data);
        }
      }
    });

    this.events.getAddOrder().subscribe((id) => {
      if (id) {
        setTimeout(() => {
          let index1 = this.notifications.findIndex((elt) => {
            return elt.localId === id['localId'];
          });
          if (index1 >= 0) {
            this.notifications.splice(index1, 1, id);
            /* let tab = [];
            tab = JSON.parse(localStorage.getItem(`userCommande`));

            if (tab && tab.length) {
              let index2 = tab.findIndex((elt) => {
                return elt.localId === id;
              });
              // changes["Posconfirm"] = true;
              if (index2 >= 0) {
                let changes = tab[index2];
                this.notifications.splice(index1, 1, changes);
              }
            } */
          }
        }, 400);
      }
    });
    this.events.getInvoiceCancel().subscribe((data) => {
      setTimeout(() => {
        if (data['localId']) {
          let index = this.notifications.findIndex((elt) => {
            return elt.localId == data['localId'];
          });
          if (index >= 0) {
            this.notifications = this.notifications.filter((elt) => {
              return elt.localId !== data['localId'];
            });
          }
        }
      }, 2000);
    });
  }

  ngOnInit() {}

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      this.webServerSocket(this.adminId);
    });
  }

  Send(order) {
    order.anime = true;
    order.leftposition = true;
    order['Posconfirm'] = true;
    // order["confirm"] = true;
    //  console.log(order);

    let index;
    if (order['localId']) {
      index = this.notifications.findIndex((elt) => {
        return elt.localId === order['localId'];
      });
      //  console.log(index);
    } else {
      index = this.notifications.findIndex((elt) => {
        return elt._id === order['_id'];
      });
      // console.log(index);
    }

    if (index >= 0) {
      this.items['_results'][index].nativeElement.classList.add(
        'animated',
        'bounceOutLeft',
        'delay-0s'
      );
      if (this.tabResto.length > 0) {
        //  this.PrintBill2(this.tabResto);
      }
      if (order['commande']['reste']) {
      }
      //alert("envoi invoices");
      this.events.publishOrder(order);
      this.events.posStoreOrders(order, 'update').then((res) => {});
      setTimeout(() => {
        // console.log(index);

        if (order['localId']) {
          order['Posconfirm'] = true;
          this.notifications = this.notifications.filter((elt) => {
            return elt.localId !== order.localId;
          });
        } else {
          this.notifications = this.notifications.filter((elt) => {
            return elt._id !== order._id;
          });
        }
        this.valueChange.emit(order);
      }, 500);
    }
  }

  async Display(order, j) {
    this.tabResto = [];
    //console.log(j);
    // console.log(order);
    // console.log(order["commande"]["plat"]);
    if (order['commande'] && order['commande']['plat']) {
      let platList = order['commande']['plat'];
      this.grouped = this.groupBy(platList, 'plat');
    }

    this.items['_results'][j].nativeElement.classList.remove(
      'animated',
      'heartBeat',
      'signalColor',
      'infinite',
      'delay-2s'
    );
    this.sum = 0;
    this.montantR = 0;
    this.reste = 0;
    if (order['show']) {
      order['show'] = false;
    } else {
      order['show'] = true;

      // this.factories = this.order["products"];
      this.sum = order['commande']['cartdetails']['totalPrice'];
      // this.tableNumber = orders["tableNumber"];
      this.montantR = order['commande']['montantRecu'];
      this.reste = this.montantR - this.sum;
      // this.reste = order["commande"]["reste"];
    }

    order['products'].forEach((prod) => {
      if (prod['item']['productType'] == 'manufacturedItems') {
        prod['item']['userName'] = order['userName'];
        this.tabResto.push(prod);
      }
    });
    // console.log(this.tabResto);
  }
  webServerSocket(id) {
    this.sockets = io(this.url);

    // this.socket.connect();
    // this.appOnline = true;
    // this.sockets.emit("login", { name: "erico mballus", admin: "23654782" });
    this.sockets.on(`${id}newOrder`, async (data) => {
      // this.makePdf();
      if (this.appOnline) {
        let tabResto2 = [];
        this.grouped = [];

        let check = localStorage.getItem('printerAutorisation');
        if (check === 'yes') {
          let tab;
          /* if (JSON.parse(localStorage.getItem(`userCommande`))) {
            tab = JSON.parse(localStorage.getItem(`userCommande`));
          }*/
          // tab = this.cache.getCachedRequest('userCommande');
          if (tab && tab.length) {
            setTimeout(() => {
              // tab.push(data);
              //this.cache.cacheRequest(`userCommande`, tab);
              // this.events.newOrder(commande);
            }, 500);
          } else {
            setTimeout(() => {
              // let store = [];
              // store.push(data);
              //this.cache.cacheRequest(`userCommande`, store);
              //  this.events.newOrder(commande);
            }, 500);
          }
          setTimeout(() => {
            console.log('start all');
            let tab = this.notifications.filter((elt) => {
              return elt.localId == data.localId || elt._id == data._id;
            });
            if (tab.length) {
              console.log('existe');
            } else {
              data['signal'] = true;
              this.notifications.push(data);
              setTimeout(() => {
                this.PrintBill(data);
              }, 4000);
              if (data['commande'] && data['commande']['plat']) {
                tabResto2 = data['commande']['plat'];
                this.grouped = this.groupBy(tabResto2, 'plat');
                setTimeout(() => {
                  this.PrintBill2(
                    this.grouped,
                    data['userName'],
                    data['numFacture']
                  );
                }, 6000);
              }
            }
          }, 400);
          setTimeout(() => {
            // this.Send(data);
          }, 30000);
        } else {
          setTimeout(() => {
            let tab = this.notifications.filter((elt) => {
              return elt.localId == data.localId;
            });
            if (tab.length) {
              console.log('existe');
            } else {
              console.log('here =========+++-----');

              /*  data["signal"] = true;
              this.notifications.push(data);
              setTimeout(() => {
                let tabl = [];
                data["commande"]["products"].forEach((elt) => {
                  if (elt.item.productType == "manufacturedItems") {
                    console.log("resto");
                  } else {
                    tabl.push(elt);
                  }
                });
                data["printelt"] = tabl;
                this.PrintBill(data);
              }, 4000); */
            }
          }, 400);
          /* if (data["commande"] && data["commande"]["plat"]) {
            tabResto2 = data["commande"]["plat"];
            this.grouped = this.groupBy(tabResto2, "plat");
            setTimeout(() => {
              this.PrintBill2(
                this.grouped,
                data["userName"],
                data["numFacture"]
              );
            }, 6000);
          } */
        }
      }

      //
    });

    this.sockets.on(`${id}invoiceadd`, (data) => {
      if (this.appOnline) {
        setTimeout(() => {
          let index = this.notifications.findIndex((elt) => {
            return elt._id === data['_id'];
          });
          if (index >= 0) {
            this.notifications.splice(index, 1, data);
          }
        }, 500);
      }
    });

    this.sockets.on(`${this.adminId}confirmOrder`, (data) => {
      if (this.appOnline) {
        this.notifications = this.notifications.filter((elt) => {
          return elt._id !== data._id;
        });
      }
    });
  }

  // class="animatd fadeOutLeft delay-2s"
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

    //
    let check = localStorage.getItem('printerAutorisation');
    if (check === 'yes') {
      setTimeout(() => {
        this.printService.printText(texte);
      }, 5000);
    } else {
    }
    this.tabResto = [];
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

  PrintBill(order) {
    // let texte = this.myBill.nativeElement.innerText;
    let small = Array(5 + 1).join(' ');
    let arr: any = [];
    let montantT = 0;
    let printerSize = '';
    if (localStorage.getItem('printerSize')) {
      printerSize = localStorage.getItem('printerSize');
    } else {
      printerSize = 'large';
    }
    order.commandes.forEach((elt, i) => {
      arr.push(
        `               COMMANDE ${i + 1}:  ${
          elt.cartdetails.totalPrice
        }  FCFA\n`
      );
      elt['products'].forEach((row) => {
        let name: string = row.item.name.toUpperCase();
        montantT = montantT + row.price;
        if (name.length < 22 && printerSize == 'large') {
          let n = 22 - name.length;
          for (let i = 0; i < n; i++) {
            name = name + ` `;
          }
        } else {
          if (name.length > 10) {
            name = name.slice(0, 9);
          } else {
            let padding = Array(10 - name.length).join(' ');
            name = name + padding;
          }
        }

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
          this.longueurLigne = s.length;
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
          this.longueurLigne = s.length;
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
          this.longueurLigne = s.length;
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
          this.longueurLigne = s.length;
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

          let a = `${name}   ${row.qty}     ${pv}   ${
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
      if (this.totalArticleBTL || this.totalArticleCA) {
        arr.push(`TOTAL COLIS: \n`);
        arr.push(
          `Arti:  ${this.totalArticle}  ca: ${this.totalArticleCA}  Btl: ${this.totalArticleBTL} \n`
        );
      }
      if (order.trancheList && order.trancheList.length) {
        arr.push(`               HISTORIQUE DE PAIEMENT:   \n`);
        order.trancheList.forEach((row) => {
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
            pv = pv + ` `;
          }
          let size = 16 - theDate.length; // espace a ajouter devant la date
          let small = Array(size).join(' ');
          let name_space = 16 - name.length;
          let espa = Array(name_space).join(' ');
          let a = `${theDate}${small}${pv}${espa}${name}\n`;
          let ligne = '';
          for (let i = 0; i < a.length - 1; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          this.longueurLigne = s.length;
          arr.push(s);
        });
      }

      if (this.consigneTab && this.consigneTab.length) {
        let totalCa = 0;
        let totalBtl = 0;
        console.log(this.consigneTab);

        arr.push(`               EMBALLAGES EN CONSIGNES:   \n`);
        arr.push(`ARTICLES                Qté      PU      TOTAL\n`);
        this.totalConsigne;
        this.totalCassier;
        this.totalBtl;
        let a = `Cassier                   ${this.totalCassier}    ----    ${this.totalConsigne}\n`;
        let b = `bouteille                  ${this.totalBtl}    ---    ----\n`;
        let ligne = '';
        for (let i = 0; i < a.length - 1; i++) {
          ligne = ligne + `-`;
        }
        let s = a + `${ligne}`;
        let s1 = b + `${ligne}`;
        arr.push(s);
        arr.push(s1);
        if (this.totalArticle) {
          let li = `\n`;
          arr.push(
            li +
              `TOTAL CONSIGNE: ca: ${this.totalCassier}  Btl: ${this.totalBtl} \n`
          );
        }

        /*  this.consigneTab.forEach((row) => {   totalConsigne
          let pv = (row.price ? row.price : 0).toString();
          let n = 12 - pv.length;
          for (let i = 0; i < n; i++) {
            pv = pv + ` `;
          }
          let art = row.item.name;
          if (art.length > 12) {
            art = art.substring(0, 8);
          }
          let space1 = Array(16 - art.length).join(' ');
          let space2 = Array(10).join(' ');
          let a = `${art}${space1}${row.cassier ? row.cassier : 0}${space2}${
            row.bouteille ? row.bouteille : 0
          }${space2}${pv}\n`; //4ensuite 15
          let ligne = '';
          for (let i = 0; i < a.length - 1; i++) {
            ligne = ligne + `-`;
          }
          let s = a + `${ligne}`;
          this.longueurLigne = s.length;
          arr.push(s);
        }); */
      }
    });

    this.makePdf(arr, montantT, order['userName'], order['numFacture'], order);

    let check = localStorage.getItem('printerAutorisation');
    if (check === 'yes') {
    } else {
    }
  }
  localServer(res) {
    let data = 'erico';
    data = JSON.parse(JSON.stringify(res));
    data['commande'] = data['cart'];
    data['products'] = data['cart']['products'];
    data['commandes'] = [data['cart']];
    let tabResto2 = [];
    this.grouped = [];
    let check = localStorage.getItem('printerAutorisation');
    //this.notifications.push(data);
    if (check && check === 'yes') {
      setTimeout(() => {
        this.notifications.push(data);
      }, 400);

      setTimeout(() => {
        let tabl = [];
        data['commande']['products'].forEach((elt) => {
          if (elt.item.productType == 'manufacturedItems') {
            // console.log("resto");
          } else {
            tabl.push(elt);
          }
        });
        data['printelt'] = tabl;
        if (tabl.length) {
          this.PrintBill(data);
        }

        if (data['commande'] && data['commande']['plat']) {
          tabResto2 = data['commande']['plat'];
          this.grouped = this.groupBy(tabResto2, 'plat');

          this.PrintBill2(this.grouped, data['userName'], data['numFacture']);
        }
      }, 1500);
    } else {
      setTimeout(() => {
        this.notifications.push(data);
      }, 400);
    }
  }

  makePdf(data, sum, userName, numTable, order) {
    let proprio = JSON.parse(localStorage.getItem('credentialAccount'))[
      'users'
    ][0];
    let pro = `PROMOTEUR: ${proprio.firstName} ${proprio.lastName}   TEL: ${proprio.telephone}`;
    let d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let heure = d.getHours();
    let minute = d.getMinutes();
    let origin = new Date(order.created);
    let LADATE = `DATE: ${origin.getDate()}/${
      origin.getMonth() + 1
    }/${origin.getFullYear()}\n`;
    let client = `\n`;
    client = pro + client;
    if (order.commande && order.commande.customer) {
      client =
        client +
        `CLIENT: ${order.commande.customer.name}         TEL: ${order.commande.customer.phone}\n`;
    }
    let name = userName.toUpperCase();
    let text1 =
      client +
      `SERVICE: ${name}         FACTURE:  ${year}${month}${day}${numTable}\n`;

    let validUntil = `Imprimée le: ${day}/${month}/${year}  ${heure}h:${minute}min\n\n`;
    text1 = text1 + LADATE + validUntil;
    let text = '';
    data.forEach((elt) => {
      text = text + `${elt}\n`;
    });
    let textFinal = text1 + `${text}`;

    // console.log(textFinal);

    /* if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      var node = document.getElementById('print-section');

      return;
    } */
    if (!this.platform.is('android') && !this.platform.is('ios')) {
      // this.openPDF();
      let texteEntete = '\n';
      let setting = JSON.parse(localStorage.getItem('setting'));
      if (setting['entete_facture']) {
        let entete = setting['entete_facture'].toUpperCase();
        texteEntete = `${entete}\n`;
      }
      let data = {
        texteEntete: texteEntete,
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

    this.printService.scan2(
      textFinal,
      sum,
      this.montantR,
      this.longueurLigne,
      this.totalImpaye,
      this.totalConsigne
    );
  }
  takeImage() {
    return new Promise((resolve, reject) => {
      this.http
        .get('/assets/willy.png', { responseType: 'blob' })
        .subscribe((res) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            var base64data = reader.result;
            //  alert(base64data);
            resolve(base64data);
          };

          reader.readAsDataURL(res);
          // console.log(res);
        });
    });
  }

  takeImage2(testurl) {
    return new Promise((resolve, reject) => {
      this.http.get(testurl, { responseType: 'blob' }).subscribe((res) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          var base64data = reader.result;
          // alert(base64data);
          resolve(base64data);
        };

        reader.readAsDataURL(res);
        console.log(res);
      });
    });
  }

  buildTableBody(data, columns) {
    var body = [];

    body.push(columns);

    data.forEach(function (row) {
      var dataRow = [];

      columns.forEach(function (column) {
        //    alert(row[column].toString())
        // dataRow.push(row[column].toString());
        dataRow.push({
          text: row[column.text].toString(),
          alignment: 'center',
        });
      });

      body.push(dataRow); // I want this row to align center...
    });

    return body;
  }
}
