import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Invoice } from 'src/app/models/invoice';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { AdminService } from 'src/app/services/admin.service';
import { PrinterService } from 'src/app/services/printer.service';
import { Setting } from 'src/app/models/setting.models';
import { NotificationService } from 'src/app/services/notification.service';
import { ConsigneManagerService } from 'src/app/services/consigne-manager.service';
import { InvoicesService } from 'src/app/services/invoices.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { GammeService } from 'src/app/services/gamme.service';
import { UrlService } from 'src/app/services/url.service';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage implements OnInit {
  model: NgbDateStruct;
  date: { year: number; month: number };
  order: any;
  order2: any;
  tabRoles = [];
  manager: boolean = false;
  status: boolean;
  sum = 0;
  montantR = 0;
  montantR_Random = 0;
  reste = 0;
  userName: any;
  company: any;
  tableNumber: number = 0;
  oldReste = 0;
  oldMontantR = 0;
  oldEventValue = 0;
  resetValue = 0;
  factories = [];
  valide = false;
  check = 0;
  resteP = 0;
  rembourse = 0;
  serveur = false;
  longueurLigne = 0;
  isLoading = false;
  url = 'http://localhost:3000/';
  billView = false;
  consigneTab = [];
  customerConsigne = [];
  totalConsigne = 0; //prix total consigne
  totalCassier = 0;
  totalBtl = 0;
  companyInfo: any;
  totalImpaye = 0;
  totalArticle = 0;
  totalArticleBTL = 0;
  totalArticleCA = 0;
  bonus = 0;
  setting: Setting;
  useGamme: boolean;
  montantReduction = 0;
  sumRandom = 0;
  destroy$: Subject<boolean> = new Subject<boolean>();
  URI: string = '';
  enablePhoneNumber = false;
  phoneNumber: any = 0;
  phoneList: any[] = [];
  transport = 0;
  phyto = 0;
  taxeRetrait = 0;
  emballage = 0;
  poids_estimatif = 0;
  transport_colis = 0;
  customerType: any = null;
  displayItem = true;
  grammage = 0;
  // setting: Setting
  constructor(
    private saveRandom: SaverandomService,
    private modal: ModalController,
    private printService: PrinterService,
    private notifi: NotificationService,
    public consigne: ConsigneManagerService,
    private inv: InvoicesService,
    private adminService: AdminService,
    private offlineManager: OfflineManagerService,
    private calendar: NgbCalendar,
    private gammeService: GammeService,
    private urlService: UrlService
  ) {}
  ngOnInit() {
    this.model = this.calendar.getToday();
    this.setting = this.saveRandom.getSetting();
  }

  ionViewWillEnter() {
    this.customerType = this.saveRandom.getClientType();
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // ("url", this.url);
    });
    this.grammage = this.saveRandom.getGrammage();
    this.poids_estimatif = this.grammage;
    if (this.saveRandom.dhlObj) {
      this.taxeRetrait = parseInt(this.saveRandom.dhlObj.taxeRetrait);
      this.phyto = this.saveRandom.dhlObj.phyto;
      this.transport = this.saveRandom.dhlObj.DHL;
    }
    if (this.saveRandom.dhlObj) {
      this.poids_estimatif = this.saveRandom.dhlObj.poids_estimatif;
    }
    let all = this.saveRandom.getData();
    this.phoneList = this.saveRandom.getSetting().phoneList;
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.order = all['invoice'];
    this.URI = all['url'];
    this.order['delivery'] = false;

    if (this.order['reste'] > 0) {
      this.order['reimbursed'] = 2;
      this.order['remb'] = true;
    }

    if (this.customerType == 'SM') {
      this.displayItem = false;
      this.order['paiment_type'] = 'Depot_Vente';
      this.order['confirmPaie'] = false;
      this.order['cash'] = false;
      this.order['sale'] = true;
    } else {
      this.order['paiment_type'] = 'Cash';
      this.order['confirmPaie'] = true;
      this.order['cash'] = true;
      this.order['sale'] = true;
    }
    this.order2 = this.order;
    if (this.order2['trancheList'] && this.order2['trancheList'].length) {
      let mont = 0;
      this.order2['trancheList'].forEach((tranch) => {
        if (tranch['montant']) {
          mont = mont + tranch['montant'];
        }
      });
    }

    let tab = this.order['commandes'];
    tab.forEach((order) => {
      if (order['consigne'] && order['consigne'].length) {
        this.consigneTab = [...this.consigneTab, ...order['consigne']];
      }
      order.products.forEach((com) => {
        if (com.item.modeG && com.item.modeNG) {
          this.sum = this.sum + com.item.sellingPrice * com.item.modeG;
          this.sum = this.sum + com.item.sellingPrice * com.item.modeNG;
        } else if (com.item.modeNG) {
          this.sum = this.sum + com.item.sellingPrice * com.item.modeNG;
        } else if (com.item.modeG) {
          this.sum = this.sum + com.item.sellingPrice * com.item.modeG;
        } else {
          this.sum = this.sum + com.item.sellingPrice * com.item.qty;
        }
        console.log(this.sum);
      });
      this.sumRandom = this.sum;
      if (this.order.commande.montantReduction) {
        this.sum = this.order.commande.montantReduction;
      }
    });
    if (this.consigneTab.length) {
      this.consigneTab.forEach((elt) => {
        if (elt['price']) {
          this.totalConsigne += elt.price;
        }
        if (elt['cassier']) {
          this.totalCassier = this.totalCassier + parseInt(elt['cassier']);
        }
        if (elt['bouteille']) {
          this.totalBtl = this.totalBtl + parseInt(elt['bouteille']);
        }
      });
    }
    this.extractQuantity(this.order.commandes);

    if (this.order.customerId && this.order.customerId !== 'vide') {
      let id = this.order.customerId;
      this.getRetailerInvoice(id, this.order);
    }
    this.factories = this.order['products'];

    this.tableNumber = this.order['tableNumber'];
    if (this.order['trancheList'] && this.order['trancheList'].length) {
      this.order['trancheList'].forEach((tranch) => {
        if (tranch['montant']) {
          this.montantR = this.montantR + parseInt(tranch['montant']);
        }
      });
      this.reste = this.montantR - this.sum;
      if (this.reste) {
        this.rembourse = this.reste;
      } else {
        this.resteP = this.reste;
      }

      if (this.montantR < this.sum) {
        this.resteP = this.montantR - this.sum;
        // this.montantR_Random = this.montantR;
      }

      this.oldMontantR = this.montantR;
      this.reste = this.montantR - this.sum;
      this.oldReste = this.reste;
      if (this.reste && this.reste < this.sum) {
        this.valide = false;
      } else {
        this.valide = true;
      }
    } else if (this.order['commandes']) {
      let tab = this.order['commandes'];
      tab.forEach((order) => {
        if (order['montantRecu']) {
        }
      });
      this.reste = this.montantR - this.sum;
      if (this.reste) {
        this.rembourse = this.reste;
      } else {
        this.resteP = this.reste;
      }

      if (this.montantR < this.sum) {
        this.resteP = this.montantR - this.sum;
        // this.montantR_Random = this.montantR;
      }

      this.oldMontantR = this.montantR;
      this.reste = this.montantR - this.sum;
      this.oldReste = this.reste;
      if (this.reste && this.reste < this.sum) {
        this.valide = false;
      } else {
        this.valide = true;
      }
    } else {
      // this.montantR = 0;
      this.reste = 0;
    }

    if (this.order['montantR']) {
    }

    this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    this.companyInfo = JSON.parse(localStorage.getItem('credentialAccount'))[
      'users'
    ][0];
    this.company = this.companyInfo['company'];

    if (this.tabRoles.includes(2)) {
      this.manager = true;
    }

    if (this.order.customerId !== 'vide') {
      this.consigne
        .getUserConsigne(this.order.customerId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data: any) => {
          if (data['docs'] && data['docs'].length) {
            console.log(data['docs']);

            while (this.consigneTab.length) {
              this.consigneTab.pop();
            }
            this.customerConsigne = data['docs'];

            data['docs'].forEach((con) => {
              con['articles'].forEach((elt) => {
                if (elt['price']) {
                  //  this.totalConsigne += elt['price'];
                }
              });

              if (this.consigneTab.length > 0) {
                this.consigneTab = [...this.consigneTab, ...con['articles']];
              } else {
                let data = con['articles'];
                this.consigneTab = con['articles'];
              }
            });
            this.consigneTab.forEach((elt) => {
              if (elt['price']) {
                this.totalConsigne += elt.price;
              }
              if (elt['cassier']) {
                this.totalCassier =
                  this.totalCassier + parseInt(elt['cassier']);
              }
              if (elt['bouteille']) {
                this.totalBtl = this.totalBtl + parseInt(elt['bouteille']);
              }
            });
          }
        });
    }

    let setting = JSON.parse(localStorage.getItem('setting'));

    if (setting['use_bonus']) {
      this.order.commandes.forEach((com) => {
        com['products'].forEach((prod) => {
          this.bonus = prod.item.bonus + this.bonus;
        });
      });
    }
  }

  closeModal() {
    // this.modal.dismiss();
  }

  async confirmLivraison() {
    if (this.order['delivery']) {
      this.order['delivery'] = false;
    } else {
      this.order['delivery'] = true;
    }
  }
  typeDePaiment(ev) {
    console.log(ev);
    this.order['paiment_type'] = ev.detail.value;
    if (ev.detail.value == 'CASH' || ev.detail.value == 'CARD') {
      // this.enablePhoneNumber = true;
      this.order['paiment_type'] = ev.detail.value;
    } else {
      this.order['paiment_type'] = ev.detail.value.name;
      this.order['phoneNumber'] = ev.detail.value.telephone;
    }
    console.log(this.order);
  }
  paieAndPrint() {
    console.log(
      new Date(
        this.model.year,
        this.model.month - 1,
        this.model.day + 1
      ).toISOString()
    );
    this.saveRandom.setData(null);
    this.order['cash'] = true;
    this.order['sale'] = true;
    this.order['swConfirm'] = false;
    this.order['deliveryDate'] = new Date(
      this.model.year,
      this.model.month - 1,
      this.model.day
    ).toISOString();

    if (this.tabRoles.includes(9)) {
      this.order['caisseConfirm'] = true;
    }
    if (this.tabRoles.includes(8)) {
      this.order['sale'] = false;
      this.order['sale'] = false;
      this.order['scConfirm'] = true;
      this.order['emballage'] = this.emballage;
      this.order['phytosanitaire'] = this.phyto;
      this.order['transport'] = this.transport;
      this.order['taxeRetrait'] = this.taxeRetrait;
      this.order['poids_estimatif'] = this.poids_estimatif;
      this.order['transport_colis'] = this.transport_colis;
      this.order['removeProductList'] =
        this.gammeService.getRemoveProductList();
      this.order['addProductList'] = this.gammeService.getaddProductList();
    }

    if (this.tabRoles.includes(9)) {
      this.order['sale'] = true;
      this.order['caisseConfirm'] = true;
      this.order['scConfirm'] = true;
    }
    this.offlineManager
      .storeCommande(this.URI, 'POST', this.order)
      .subscribe((res) => {
        this.saveRandom.setZone(null);
        if (this.saveRandom.getProductToUpdate()) {
          let obj = this.saveRandom.getProductToUpdate();
          for (var id in obj) {
            let url = `${this.url}productlist/?db=${obj[id].product.adminId}`;

            let p = obj[id].product;
            if (p.bottle_empty && p.bottle_empty > 0) {
              p.bottle_empty = p.bottle_empty + obj[id].quantity;
              if (p.bottle_empty < 0) {
                p.bottle_empty = 0;
              }
              if (p.bottle_total < 0) {
                p.bottle_total = 0;
              }
              p.bottle_total = p.bottle_empty + p.bottle_full;
            } else {
              p.bottle_empty = obj[id].quantity;
              p.bottle_total = p.bottle_empty + p.bottle_full;
            }
            let ob = {};
            for (const key in p) {
              ob[key] = p[key];
            }

            delete ob['name']; //le nom ici ne change pas
            this.offlineManager
              .storeCommande(url, 'PATCH', ob)
              .subscribe((res) => {});
          }
        }
        this.saveRandom.setProductToUpdate(null);
        this.modal.dismiss();
        this.Print();
        this.saveRandom.setGrammage(null);
        this.gammeService.clearArray();
      });
  }

  Print() {
    this.printService.PrintInvoice(
      this.order,
      this.order2,
      this.longueurLigne,
      this.totalArticleBTL,
      this.totalArticleCA,
      this.totalArticle,
      this.consigneTab,
      this.totalConsigne,
      this.totalCassier,
      this.totalBtl,
      this.montantR,
      this.totalImpaye
    );
  }

  extractQuantity(product: any[]) {
    let arr = product[0]['products'];
    arr.forEach((prod) => {
      if (prod.item.CA) {
        this.totalArticle = this.totalArticle + prod.item.CA;
        this.totalArticleCA = this.totalArticleCA + prod.item.CA;
      }
      if (prod.item.BTL) {
        this.totalArticle = this.totalArticle + prod.item.BTL;
        this.totalArticleBTL = this.totalArticleBTL + prod.item.BTL;
      }
      if (prod.item.modeNG) {
        this.totalArticle = this.totalArticle + prod.item.modeNG;
      }
      if (prod.item.modeG) {
        this.totalArticle = this.totalArticle + prod.item.modeG;
      }
      if (
        !prod.item.modeG &&
        !prod.item.modeNG &&
        !prod.item.CA &&
        !prod.item.BTL &&
        prod.item.qty
      ) {
        this.totalArticle = this.totalArticle + prod.item.qty;
      }
    });
  }

  getRetailerInvoice(id, order) {
    this.notifi.presentLoading();
    this.inv
      .getInvoiceNotPaie(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (invoices) => {
          this.notifi.dismissLoading();

          invoices['docs'] = invoices['docs'].filter((row) => {
            return row['_id'] !== order._id;
          });
          invoices['docs'].forEach((inv) => {
            if (!inv['sale'] && !inv['invoiceCancel']) {
              if (!inv['sale'] && inv['trancheList'].length) {
                let montAvance = 0;
                inv['trancheList'].forEach((tranche) => {
                  montAvance += tranche['montant'];
                });
                let reste = inv.commande.cartdetails.totalPrice - montAvance;
                this.totalImpaye += reste;
              } else {
                this.totalImpaye += inv.commande.cartdetails.totalPrice;
              }
            }
          });
        },
        (err) => {
          this.notifi.dismissLoading();
        }
      );
  }

  remboursement() {
    this.order['remb'] = !this.order['remb'];
    if (this.order['reimbursed'] == 1) {
      this.order['reimbursed'] = 2;
    } else {
      this.order['reimbursed'] = 1;
    }
  }
}
