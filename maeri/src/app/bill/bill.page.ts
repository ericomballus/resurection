import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { environment, uri } from '../../environments/environment';
import { DetailsPage } from '../point-of-sale/details/details.page';
import { SaverandomService } from 'src/app/services/saverandom.service';
import {
  ModalController,
  AlertController,
  LoadingController,
  ActionSheetController,
} from '@ionic/angular';

import { Router } from '@angular/router';
import { AdminService } from '../services/admin.service';
import io from 'socket.io-client';
import { UrlService } from '../services/url.service';
import { ScreensizeService } from '../services/screensize.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { NotificationService } from '../services/notification.service';
import { CachingService } from '../services/caching.service';
import { ManagesocketService } from '../services/managesocket.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Setting } from '../models/setting.models';
import { Product } from '../models/product.model';
import { Invoice } from '../models/invoice';
import { Bill } from '../models/bill.model';
import { TranslateService } from '@ngx-translate/core';
//import { IonSlides} from '@ionic/angular';
@Component({
  selector: 'app-bill',
  templateUrl: './bill.page.html',
  styleUrls: ['./bill.page.scss'],
})
export class BillPage implements OnInit {
  invoices = [];
  montant = 0;
  rembourse = 0;
  tabRoles = [];
  userName: any;
  tabBill = [];
  isLoading = false;
  printAutorisation = false;
  public urlEvent;
  isDesktop: boolean;
  destroy$ = new Subject();
  setting: Setting;
  useGamme: boolean;
  produitRetour: Product[] = [];
  cancelInvoices: any[] = [];
  constructor(
    private adminService: AdminService,
    private translateConfigService: TranslateConfigService,
    public alertController: AlertController, // public translate: TranslateService
    private urlService: UrlService,
    public loadingController: LoadingController,
    public modalController: ModalController,
    public router: Router,
    public notif: NotificationService,
    public screensizeService: ScreensizeService,
    private cache: CachingService,
    private manageSocket: ManagesocketService,
    private saveRandom: SaverandomService,
    public actionSheetController: ActionSheetController,
    public translate: TranslateService
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(4)) {
      this.printAutorisation = true;
      let adminId = localStorage.getItem('adminId');
      this.webServerSocket(adminId);
    }

    setTimeout(() => {
      // this.getBill();
    }, 1000);
    this.languageChanged();
    this.takeUrl();
  }

  ngOnInit() {
    this.screenCheck();
    this.setting = this.saveRandom.getSetting();
    if (this.setting && this.setting.use_gamme) {
      this.useGamme = this.setting.use_gamme;
    }
  }

  ionViewDidEnter() {
    this.getBill();
    this.getAllInvoiceCancel();
  }
  ionViewWillLeave() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  languageChanged() {
    let lang = localStorage.getItem('language');

    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  async takeUrl() {
    this.urlService.getUrlEvent().subscribe(async (data) => {
      this.urlEvent = await data;
    });
  }

  webServerSocket(id) {
    this.manageSocket
      .getSocket()
      .pipe(takeUntil(this.destroy$))
      .subscribe((sockets) => {
        sockets.on(`${id}billCancel`, (data) => {
          console.log('bill cancel', data);
          this.invoices = this.invoices.filter((bill) => {
            if (bill._id) {
              return bill._id !== data._id;
            } else {
              return bill.localId !== data.localId;
            }
          });
        });
      });
  }

  screenCheck() {
    setTimeout(() => {
      this.screensizeService.isDesktopView().subscribe((isDesktop) => {
        if (this.isDesktop && !isDesktop) {
        }

        this.isDesktop = isDesktop;
      });
    }, 10);
  }

  async getBill() {
    this.notif.presentLoading();

    let tab = [];
    tab = this.router.url.split('/');

    if (
      this.tabRoles.includes(4) ||
      this.tabRoles.includes(9) ||
      this.tabRoles.includes(7) ||
      this.tabRoles.includes(8) ||
      this.tabRoles.includes(10)
    ) {
      this.adminService.getBill().subscribe(
        (data) => {
          if (data['docs'].length) {
            this.montant = 0;
            this.rembourse = 0;
            data['docs'].forEach((elt) => {
              if (elt.commande.montantReduction) {
                this.montant = this.montant + elt.commande.montantReduction;
                elt.montantReduction = elt.commande.montantReduction;
              } else {
                this.montant = this.montant + elt.montant;
              }
              if (elt['trancheList'] && elt['trancheList'].length) {
                elt['recu'] = 0;
                elt['trancheList'].forEach((t) => {
                  elt['recu'] = elt['recu'] + t['montant'];
                  console.log(elt['recu']);
                });
              }

              if (elt['rembourse'] && elt['reimbursed'] == 1) {
                this.rembourse = this.rembourse + elt.rembourse;
              }

              if (elt['recu']) {
                elt.rembourse = elt['recu'] - elt.montant;
              }
            });
            data['docs'].forEach((inv: Invoice) => {
              let index = this.invoices.findIndex(
                (elt: Invoice) => elt.localId == inv.localId
              );
              if (index >= 0) {
                this.invoices.splice(index, 1, inv);
              } else {
                this.invoices.push(inv);
              }
            });

            this.invoices = this.invoices.sort(
              (a, b) => (a.numFacture < b.numFacture ? 1 : -1)
              /* if (a.numFacture < b.numFacture) {
              return 1;
            }*/
              //return 0;
            );
            this.notif.dismissLoading();
          } else {
            this.notif.dismissLoading();
            this.notif.presentToast('pas de factures disponibles', 'primary');
          }
        },
        (err) => {
          this.notif.dismissLoading();
          console.log(err);
        }
      );
    }
    let facturePayées: any[] = await this.cache.getCachedRequest('invoicePaie');
    if (facturePayées && facturePayées.length) {
      let tab = facturePayées;

      this.montant = 0;
      this.rembourse = 0;

      tab.forEach((elt) => {
        let montR = 0;
        console.log('voici element', elt);

        elt['confirm'] = true;
        if (elt.commande && elt.commande.montantReduction) {
          elt['montant'] = elt.commande.montantReduction;
          elt['montantReduction'] = elt.commande.montantReduction;
        } else if (
          elt['commande'] &&
          elt['commande']['cartdetails'] &&
          elt['commande']['cartdetails']['totalPrice']
        ) {
          elt['montant'] = elt['commande']['cartdetails']['totalPrice'];
        }

        if (elt['trancheList'] && elt['trancheList'].length) {
          elt['recu'] = 0;
          elt['trancheList'].forEach((t) => {
            elt['recu'] = elt['recu'] + t['montant'];
          });
        }

        elt['Posconfirm'] = true;
        this.montant = this.montant + elt.montant;
        if (elt['rembourse'] && elt['reimbursed'] == 1) {
          this.rembourse = this.rembourse + elt.rembourse;
        }
        if (elt['trancheList'] && elt['trancheList'].length) {
          elt['trancheList'].forEach((tranche) => {
            montR = montR + tranche['montant'];
          });
          if (montR - elt.montant >= 0) {
            elt['rembourse'] = montR - elt.montant;
          } else {
            elt['rembourse'] = 0;
          }
        }
      });
      tab = tab.sort((a, b) => {
        if (a.numFacture < b.numFacture) {
          return -1;
        }
        return 0;
      });
      this.invoices = tab;

      this.notif.dismissLoading();
    }

    if (tab.includes('my')) {
      this.adminService.getBillShop(this.urlEvent).subscribe((data) => {
        console.log('bills here', data);

        //  this.dismissLoading();
        let userName = JSON.parse(localStorage.getItem('user'))['name'];
        this.tabBill = [];
        this.montant = 0;
        this.invoices = data['docs'].reverse();

        this.montant = 0;
        this.invoices.forEach((elt) => {
          if (elt['userName'] == userName) {
            this.tabBill.push(elt);
            this.montant = this.montant + elt.montant;
          }
        });
        if (this.tabBill.length) {
          this.invoices = this.tabBill;
        } else {
          this.notif.presentToast('Acunes factures trouvées!', 'danger');
          this.invoices = [];
        }
        this.notif.dismissLoading();
      });
    } else {
      if (this.tabRoles.includes(5)) {
        this.adminService.getBillShop(this.urlEvent).subscribe((data) => {
          let userName = JSON.parse(localStorage.getItem('user'))['name'];
          this.tabBill = [];
          this.montant = 0;
          this.invoices = data['docs'].reverse();
          this.montant = 0;
          this.invoices.forEach((elt) => {
            if (elt['userName'] == userName) {
              this.tabBill.push(elt);
              this.montant = this.montant + elt.montant;
            }
          });
          this.notif.dismissLoading();
          if (this.tabBill.length) {
            this.invoices = this.tabBill;
          } else {
            this.notif.presentToast('pas de factures', 'primary');
            this.invoices = [];
          }
        });
      }
    }
  }

  async updateReimbursed(bill, i) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'voulez vous rembourser?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'OUI',
          handler: async () => {
            console.log(bill._id);
            let facturePayées: any[] = await this.cache.getCachedRequest(
              'invoicePaie'
            );
            if (facturePayées && facturePayées.length) {
              let index = facturePayées.findIndex(
                (f) => f['localId'] == bill['localId']
              );
              if (index >= 0) {
                facturePayées[index]['reimbursed'] = 2;
                this.cache.cacheRequest('invoicePaie', facturePayées);
              }
            }
            bill['reimbursed'] = 2;
            this.adminService.updateBill(bill._id).subscribe((res) => {
              bill['reimbursed'] = 2;
              // this.getBill();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async confirmCancel(invoice) {
    console.log(invoice);

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
          },
        },
      ],
    });

    await alert.present();
  }
  async displayDetails(order, index) {
    console.log(order);

    const modal = await this.modalController.create({
      component: DetailsPage,
      componentProps: {
        order: order,
        order2: order,
        // Pos: true,
        Bill: true,
      },
      cssClass: 'custom-modal',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data && res.data['cancel']) {
        let doc = res.data['result'];
        this.invoices.splice(index, 1, doc);
      }
    });
    return await modal.present();
  }
  deleteInvoice(invoice) {
    console.log(invoice);
    this.saveRandom.setData(invoice);
    this.router.navigateByUrl('delete-bill');
  }

  getAllInvoiceCancel() {
    let id = this.saveRandom.getCashOpenId();
    this.adminService.getInvoiceCancel(id).subscribe((res) => {
      let docs: Invoice[] = res['docs'];

      docs = docs.sort((a, b) => {
        if (a.numFacture < b.numFacture) {
          return -1;
        }
        return 0;
      });
      /*docs.forEach((invoice) => {
        if (!invoice.invoiceCancel && invoice.openCashDateId == id) {
          this.cancelInvoices.push(invoice);
        }
      });*/
      this.cancelInvoices = docs;
      console.log('invoice not cancel here====>', this.cancelInvoices);
    });
  }

  displayNotPaie() {
    this.saveRandom.setCustomerInvoices(this.cancelInvoices);
    this.router.navigateByUrl('invoice-cancel');
  }

  async presentActionSheet(invoice, i) {
    let a: any = {};
    this.translate.get('MENU.not_enough').subscribe((t) => {
      a['message'] = t;
    });
    let btnArr = [];
    btnArr.push({
      text: 'Details',
      role: 'destructive',
      icon: 'eye',
      handler: () => {
        this.displayDetails(invoice, i);
      },
    });
    if (invoice.reimbursed == 1) {
      btnArr.push({
        text: 'Rembourser',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
          this.updateReimbursed(invoice, i);
        },
      });
    }

    if (this.useGamme && this.tabRoles.includes(2)) {
      btnArr.push({
        text: 'Supprimer',
        icon: 'trash',
        handler: () => {
          console.log('Share clicked');
          this.deleteInvoice(invoice);
        },
      });
    }
    btnArr.push({
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log('Cancel clicked');
      },
    });
    const actionSheet = await this.actionSheetController.create({
      header: '',
      // cssClass: 'my-custom-class',

      buttons: btnArr,
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
