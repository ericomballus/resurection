import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Input,
  OnDestroy,
} from '@angular/core';
import {
  ModalController,
  AlertController,
  LoadingController,
  Platform,
  NavParams,
  // Events,
} from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { PrinterService } from 'src/app/services/printer.service';

import { Buffer } from 'buffer/';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { CancelOrderPage } from '../cancel-order/cancel-order.page';
import { MyeventsService } from 'src/app/services/myevents.service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineManagerService } from 'src/app/services/offline-manager.service';
import { UrlService } from 'src/app/services/url.service';
import { environment, uri } from '../../../environments/environment';
import { InvoicesService } from 'src/app/services/invoices.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ConsigneManagerService } from 'src/app/services/consigne-manager.service';
import domtoimage from 'dom-to-image';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { IWriteOptions } from '@ionic-native/file/ngx';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { Setting } from 'src/app/models/setting.models';
import { NumberToLetter } from 'convertir-nombre-lettre';
registerLocaleData(localeFr, 'fr');
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit, OnDestroy {
  @Input() order2: any;
  @ViewChild('myBill', { static: false }) public myBill: ElementRef;
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  @ViewChild('sectionToHide', { static: false }) invoiceToPrint: ElementRef;
  @ViewChild('pied_page', { static: false }) pied_page: ElementRef;
  order: any;
  buffer: Buffer;
  flag: boolean = false;
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
  destroy$: Subject<boolean> = new Subject<boolean>();
  bonus = 0;
  setting: Setting;
  useGamme: boolean;
  montantReduction = 0;
  sumRandom = 0;
  tabRole: any[] = [];
  printer = false;
  montantEnLettre = '';
  logo = '';
  display_pied_page = false;
  total_en_chiffre = ' ';
  total_avec_dhl = 0;
  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private adminService: AdminService,
    private printService: PrinterService,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public events: MyeventsService,
    public loadingController: LoadingController,
    private networkService: NetworkService,
    private offlineManager: OfflineManagerService,
    private urlService: UrlService,
    private platform: Platform,
    private inv: InvoicesService,
    private notifi: NotificationService,
    public consigne: ConsigneManagerService,
    private saveRandom: SaverandomService,

    private fileOpener: FileOpener,
    private resApi: RestApiService
  ) {
    this.languageChanged();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(5)) {
      this.serveur = true;
    }
    setTimeout(() => {
      if (this.order2['trancheList'] && this.order2['trancheList'].length) {
        let mont = 0;
        this.order2['trancheList'].forEach((tranch) => {
          if (tranch['montant']) {
            mont = mont + tranch['montant'];
          }
        });
      }
    }, 500);
  }

  ngOnInit() {
    if (
      this.platform.is('desktop') ||
      (this.platform.is('electron') && this.tabRoles.includes(8))
      /*
     ||
     this.tabRoles.includes(9) ||
      this.tabRoles.includes(10) ||
      this.tabRoles.includes(11)
      */
    ) {
      this.display_pied_page = true;
    }

    if (
      this.platform.is('desktop') ||
      (this.platform.is('electron') && this.tabRoles.includes(9)) ||
      this.tabRoles.includes(10) ||
      this.tabRoles.includes(11)
    ) {
      this.display_pied_page = false;
    }
  }
  hidePiedPage() {
    //console.log('jai finis ===>');
    //  this.display_pied_page = false;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  WindowPrint() {
    this.display_pied_page = true;
    this.invoiceToPrint.nativeElement.style.display = 'none';

    console.log(this.display_pied_page);
    setTimeout(() => {
      window.print();
      this.invoiceToPrint.nativeElement.style.display = 'block';
      this.display_pied_page = false;
    }, 250);
    //
    // this.pied_page.nativeElement.style.display = 'block';
  }

  ionViewDidEnter() {
    setTimeout(() => {
      // this.pied_page.nativeElement.style.display = 'none';
    }, 1500);
    if (
      this.platform.is('desktop') ||
      (this.platform.is('electron') && this.tabRoles.includes(8)) ||
      this.tabRoles.includes(9) ||
      this.tabRoles.includes(10) ||
      this.tabRoles.includes(11)
    ) {
      this.printer = true;
    }
    if (this.tabRoles.includes(4)) {
      this.printer = false;
    }
    this.setting = this.saveRandom.getSetting();
    this.useGamme = this.setting.use_gamme;
    this.tabRole = this.saveRandom.getTabRole();
    this.order = this.navParams.get('order');
    this.total_avec_dhl = this.order.montantReduction
      ? parseInt(this.order.montantReduction) +
        parseInt(this.order.taxeRetrait) +
        parseInt(this.order.phytosanitaire) +
        parseInt(this.order.transport) +
        parseInt(this.order.transport_colis)
      : this.order.commande.cartdetails.totalPrice +
        parseInt(this.order.taxeRetrait) +
        parseInt(this.order.phytosanitaire) +
        parseInt(this.order.transport) +
        parseInt(this.order.transport_colis);
    this.total_en_chiffre = NumberToLetter(this.total_avec_dhl);
    console.log(NumberToLetter(this.total_avec_dhl));
    let tab = this.order['commandes'];
    tab.forEach((order) => {
      if (order['consigne'] && order['consigne'].length) {
        this.consigneTab = [...this.consigneTab, ...order['consigne']];
      }
      // console.log('la commande ==>', order);
      order.products.forEach((com) => {
        if (com.item.modeG && com.item.modeNG) {
          this.sum = this.sum + com.item.sellingPrice * com.item.modeG;
          this.sum = this.sum + com.item.sellingPrice * com.item.modeNG;
        } else if (com.item.modeNG) {
          this.sum = this.sum + com.item.sellingPrice * com.item.modeNG;
        } else if (com.item.modeG) {
          this.sum = this.sum + com.item.sellingPrice * com.item.modeG;
        } else {
          this.sum = this.sum + com.item.sellingPrice * com.qty;
        }
        if (com.qty && !com.item.qty) {
          this.totalArticle = this.totalArticle + com.qty;
        }
        if (!com.qty && com.item.qty) {
          this.totalArticle = this.totalArticle + com.item.qty;
        }
        // console.log(this.sum);
      });
      this.sumRandom = this.sum;
      if (this.order.commande.montantReduction) {
        this.sum = this.order.commande.montantReduction;
      }
      if (order['cartdetails']) {
        //  this.sum = this.sum + parseInt(order['cartdetails']['totalPrice']);
      } else {
        order['cartdetails'] = order['cart']['cartdetails'];
        //  this.sum = this.sum + parseInt(order['cartdetails']['totalPrice']);
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
    /* this.order['commandes'].forEach((com) => {
      console.log('la commande ==>', com);
      if (com['cartdetails']) {
        this.sum = this.sum + parseInt(com['cartdetails']['totalPrice']);
      } else {
        com['cartdetails'] = com['cart']['cartdetails'];
        this.sum = this.sum + parseInt(com['cartdetails']['totalPrice']);
      }
    });*/
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
      /* this.montantR = this.order['montantR'];
      this.reste = this.montantR - this.sum;
      this.resteP = this.reste;
      this.rembourse = this.reste; */
    }

    this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    this.companyInfo = JSON.parse(localStorage.getItem('credentialAccount'))[
      'users'
    ][0];
    this.company = this.companyInfo['company'];
    if (this.navParams.get('flags')) {
      this.flag = true;
    }
    if (this.navParams.get('Pos')) {
      this.flag = true;
    } else {
      this.flag = false;
    }
    if (this.tabRoles.includes(2)) {
      this.manager = true;
    }
    if (this.navParams.get('Bill')) {
      this.billView = true;
      if (this.order.rembourse) {
        this.rembourse = this.order.rembourse;
        // this.montantR = this.sum + this.rembourse;
      } else {
        this.rembourse = this.order.rembourse;
        // this.montantR = this.order.montant;
      }
    }
    if (this.navParams.get('manager')) {
      this.billView = true;
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

  takeUrl() {
    this.urlService
      .getUrl()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.url = data;
        console.log('url', this.url);
      });
    if (environment.production) {
      this.url = this.url;
    } else {
      this.url = uri;
    }
  }

  closeModal() {
    this.modalController.dismiss('no_update');
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  buyPack() {
    let date1 = this.order['openCashDate'];
    let date2 = localStorage.getItem('openCashDate');
    let Res = 0;
    if (this.tabRole.includes(9)) {
      if (this.order.montantReduction) {
        this.sum =
          this.order.montantReduction +
          this.order.taxeRetrait +
          this.order.phytosanitaire +
          this.order.taxeRetrait;
      } else {
        this.sum =
          this.order.commande.cartdetails.totalPrice +
          this.order.taxeRetrait +
          this.order.phytosanitaire +
          this.order.taxeRetrait;
      }
    }
    if (this.tabRole.includes(9) && this.montantR_Random < this.sum) {
      this.notifi.presentToast(
        'le montant reçu est plus petit que le montant de la facture',
        'danger'
      );
      return;
    }
    if (this.tabRole.includes(10)) {
      // this.notifi.presentLoading();
      this.order['saConfirm'] = true;
      this.adminService.buyOrder(this.order).subscribe((data) => {
        this.modalController.dismiss({
          status: 'ok ok',
          invoice: this.order,
        });
      });
      //  this.dismissLoading();
      return;
    }

    if (this.montantR >= this.sum) {
      this.order['rembourse'] = this.montantR - this.sum;
      if (this.rembourse > 0) {
        this.order['rembourse'] = this.rembourse;
        this.presentAlertConfirm(this.order);
      } else {
        this.presentAlertConfirm2(this.order);
      }

      return;
    }
    if (this.montantR_Random >= this.sum) {
      this.order['rembourse'] = this.montantR_Random - this.sum;
      if (this.rembourse > 0) {
        this.presentAlertConfirm(this.order);
      } else {
        this.presentAlertConfirm2(this.order);
      }

      return;
    }

    if (this.order.annule) {
      this.order.annule = false;
    }
    if (this.montantR) {
    }
    if (this.montantR < this.sum && this.montantR_Random < this.sum) {
      // console.log(this.resetValue, 'avance');

      this.paiementNotComplete(this.order);
      // this.ordersCancel2(this.order);
      return;
    }

    if (this.reste < 0) {
      this.ordersCancel2(this.order);
    }
  }

  async paiementNotComplete(order) {
    console.log('hello fail', order);

    let a: any = {};
    this.translate.get('MENU.question1').subscribe((t) => {
      a['question1'] = t;
    });
    this.translate.get('MENU.question2').subscribe((t) => {
      a['question2'] = t;
    });
    this.translate.get('MENU.cancelInvoice').subscribe((t) => {
      a['cancelInvoice'] = t;
    });
    this.translate.get('MENU.nothing').subscribe((t) => {
      a['nothing'] = t;
    });
    const alert = await this.alertController.create({
      message: a.question1 + '?',
      buttons: [
        {
          text: a.question2 + '?',
          handler: (blah) => {
            this.notifi.presentLoading();
            let tranche = {
              created: Date.now(),
              employeId: JSON.parse(localStorage.getItem('user'))['_id'],
              employeName: JSON.parse(localStorage.getItem('user'))['name'],
              montant: this.resetValue,
            };
            if (this.order['trancheList']) {
              this.order['trancheList'].push(tranche);
              this.order['partially'] = true;
            }
            this.notifi.dismissLoading();
            this.modalController.dismiss('partially paie');
            this.adminService
              .makeAvanceOrder(this.order)
              .pipe(takeUntil(this.destroy$))
              .subscribe(
                (res) => {
                  this.notifi.presentToast('facture mise a jour!', 'success');
                },
                (err) => {
                  console.log(err);
                }
              );
          },
        },
        {
          text: a.cancelInvoice + '?',
          handler: () => {
            this.ordersCancel2(this.order);
          },
        },
        {
          text: a.nothing,
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  async confirmCancel() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: 'Cancel invoice?',
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
            console.log(this.order);

            this.notifi.presentLoading();
            this.ordersCancel(this.order);
          },
        },
      ],
    });

    await alert.present();
  }

  async ordersCancel(order?) {
    this.order.annule = true;
    if (this.order.partially) {
      this.order.partially = false;
    }
    if (this.order.onAccount) {
      this.order.onAccount = false;
    }

    const modal = await this.modalController.create({
      component: CancelOrderPage,
      componentProps: {
        order: this.order,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log('de retour', data['data']);
      if (data['data']) {
        let custumer = data['data']['user'];
        let motif = data['data']['motif'];
        if (this.order['commandes'].length > 1) {
          this.order['commandes'].forEach((elt) => {
            setTimeout(() => {
              this.adminService
                .cancelOrder2(this.order.localId, elt['products'], custumer)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  (data) => {
                    this.events
                      .posStoreOrders(this.order, 'remove')
                      .then((res) => {
                        // this.events.invoiceSale(this.order);
                        this.notifi.dismissLoading();
                        this.modalController.dismiss('cancel invoice');
                      });
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }, 200);
          });
        } else {
          this.adminService
            .cancelOrder2(this.order.localId, this.order['products'], custumer)
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              (data) => {
                this.events.posStoreOrders(this.order, 'remove').then((res) => {
                  // this.events.invoiceSale(this.order);
                  this.modalController.dismiss('cancel invoice');
                  this.notifi.dismissLoading();
                });
                if (this.order.annule) {
                  console.log('err');
                } else {
                  this.adminService
                    .createdCustumer(custumer)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((data) => {
                      console.log(data);
                    });
                }
              },
              (err) => {
                console.log(err);
              }
            );
        }
      }
    });
    return await modal.present();
  }

  async ordersCancel2(order?) {
    if (this.useGamme && this.billView) {
      this.notifi.presentLoading();
      this.adminService
        .cancelBill(this.order)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.notifi.dismissLoading();
          this.modalController.dismiss({
            bill: this.order,
            result: res,
            cancel: true,
          });
        });
    } else {
      const alert = await this.alertController.create({
        cssClass: 'my-custom-class',
        header: 'Confirm!',
        message: 'Cancel invoice ?',
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
              this.notifi.presentLoading();
              this.deleteOrder();
            },
          },
        ],
      });

      await alert.present();
    }
  }
  deleteOrder() {
    let productTab = [];
    this.order.invoiceCancel = true;

    this.order['commandes'].forEach((elt) => {
      if (productTab.length) {
        productTab = [...productTab, ...elt['products']];
      } else {
        productTab = elt['products'];
      }
    });
    this.events.posStoreOrders(this.order, 'remove').then((res) => {
      this.modalController.dismiss('cancel invoice');
      this.notifi.dismissLoading().then(() => {});
      this.adminService
        .cancelOrder2(this.order.localId, productTab, this.order)

        .subscribe(
          (data) => {},
          (err) => {
            console.log(err);
            this.notifi.dismissLoading().then(() => {});
          }
        );
      if (!this.useGamme) {
        this.deleteConsigne(this.order);
      }
    });
  }
  deleteConsigne(order) {
    let consigne = {};
    this.customerConsigne.forEach((con) => {
      if (con['invoiceId'] === order._id) {
        consigne = con;
        return;
      }
    });
    consigne['Fund'] = true;
    this.consigne.updateConsigne(consigne).subscribe(
      (res) => {
        console.log('consigne update', res);
      },
      (err) => {
        // this.notifi.presentError('sorry unable to update this order', 'danger');
      }
    );
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

  changePrice(ev, prod) {
    if (!ev.detail.value) {
      ev.detail.value = 0;
      prod.item.purchasingPrice = parseInt(ev.detail.value);
      prod.price = parseInt(ev.detail.value) * prod.qty;
    } else {
      prod.item.purchasingPrice = parseInt(ev.detail.value);
      prod.price = parseInt(ev.detail.value) * prod.qty;
    }
  }

  montabtPercu(ev) {
    this.resetValue = parseInt(ev.detail.value);
    if (parseInt(ev.detail.value) >= this.reste) {
      console.log('ok');
    }
    if (this.montantR) {
      this.montantR_Random = parseInt(ev.detail.value) + this.montantR;
      this.check = parseInt(ev.detail.value) + this.montantR;
    } else {
      this.montantR_Random = parseInt(ev.detail.value);
      this.check = parseInt(ev.detail.value);
    }
    if (parseInt(ev.detail.value) > 0) {
      this.resteP = -(this.sum - this.check);
    } else {
      this.resteP = this.montantR - this.sum;
    }

    if (this.sum - this.check >= 0) {
      // this.resteP = this.sum - this.check;
      this.rembourse = -1;
    } else {
      this.rembourse = parseInt(ev.detail.value) + this.montantR - this.sum;
      this.reste = parseInt(ev.detail.value) + this.montantR - this.sum;
    }
  }

  serveurAffiche() {}
  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
      })
      .then((a) => {
        a.present().then(() => {
          console.log('presented');
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then((res) => {})
      .catch((err) => {});
  }
  removeOne(row) {
    console.log(row);
  }

  async presentAlertConfirm(order) {
    let typ = ['CASH'];
    const alert = await this.alertController.create({
      cssClass: 'reimbursed-alert-class',
      backdropDismiss: false,
      header: 'Remboursement!',
      message: 'avez vous <strong>remboursé</strong>?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async () => {
            if (this.tabRoles.includes(4)) {
              try {
                typ = await this.notifi.typeDePaiement();
                console.log(typ);
              } catch (error) {}
            }

            this.presentLoading2();
            this.order['reimbursed'] = 1;
            this.order.cash = true;
            this.order.sale = true;
            this.order.rembourse = this.rembourse;
            this.order['partially'] = false;
            this.order['paiment_type'] = typ[0];
            if (this.tabRoles.includes(9)) {
              //this.order['swConfirm'] = true;
              this.order['caisseConfirm'] = true;
            }
            if (this.tabRoles.includes(10)) {
              //this.order['swConfirm'] = true;
              this.order['saConfirm'] = true;
            }

            if (this.resetValue > 0) {
              let tranche = {
                created: Date.now(),
                employeId: JSON.parse(localStorage.getItem('user'))['_id'],
                employeName: JSON.parse(localStorage.getItem('user'))['name'],
                montant: this.resetValue,
              };
              if (this.order['trancheList']) {
                this.order['trancheList'].push(tranche);
              } else {
                let tab = [];
                tab.push(tranche);
                this.order['trancheList'] = tab;
              }
              this.events
                .posStoreOrders(this.order, 'remove')
                .then((result) => {
                  this.dismissLoading();
                  this.modalController.dismiss({
                    status: 'ok ok',
                    invoice: this.order,
                  });
                  this.adminService
                    .makeAvanceOrder(this.order)
                    // .pipe(takeUntil(this.destroy$))
                    .subscribe((res) => {
                      this.adminService
                        .buyOrder(this.order)
                        .subscribe((data) => {});
                    });
                });
            } else {
              this.events
                .posStoreOrders(this.order, 'remove')
                .then((result) => {
                  this.adminService.buyOrder(this.order).subscribe((data) => {
                    this.dismissLoading();
                    this.modalController.dismiss({
                      status: 'ok ok',
                      invoice: this.order,
                    });
                  });
                });
            }
          },
        },
        {
          text: 'OUI',
          handler: async () => {
            if (this.tabRoles.includes(4)) {
              try {
                typ = await this.notifi.typeDePaiement();
                console.log(typ);
              } catch (error) {}
            }

            this.presentLoading2();
            this.order['reimbursed'] = 2;
            this.order['cash'] = true;
            this.order['sale'] = true;
            this.order['partially'] = false;
            this.order.rembourse = this.rembourse;
            this.order['paiment_type'] = typ[0];
            if (this.tabRoles.includes(9)) {
              // this.order['swConfirm'] = true;
              this.order['caisseConfirm'] = true;
            }
            if (this.tabRoles.includes(10)) {
              //this.order['swConfirm'] = true;
              this.order['saConfirm'] = true;
            }
            if (this.resetValue > 0) {
              let tranche = {
                created: Date.now(),
                employeId: JSON.parse(localStorage.getItem('user'))['_id'],
                employeName: JSON.parse(localStorage.getItem('user'))['name'],
                montant: this.resetValue,
              };
              if (this.order['trancheList']) {
                this.order['trancheList'].push(tranche);
              } else {
                let tab = [];
                tab.push(tranche);
                this.order['trancheList'] = tab;
              }
              this.events
                .posStoreOrders(this.order, 'remove')
                .then((result) => {
                  this.dismissLoading();
                  this.modalController.dismiss({
                    status: 'ok ok',
                    invoice: this.order,
                  });
                  this.adminService
                    .makeAvanceOrder(this.order)
                    //  .pipe(takeUntil(this.destroy$))
                    .subscribe((res) => {
                      this.adminService
                        .buyOrder(this.order)
                        .subscribe((data) => {});
                    });
                });
            } else {
              this.events
                .posStoreOrders(this.order, 'remove')
                .then((result) => {
                  this.adminService.buyOrder(this.order).subscribe((data) => {
                    this.dismissLoading();
                    this.modalController.dismiss({
                      status: 'ok ok',
                      invoice: this.order,
                    });
                  });
                });
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertConfirm2(order) {
    let typ = ['CASH'];
    const alert = await this.alertController.create({
      cssClass: 'reimbursed-alert-class',
      backdropDismiss: false,
      header: 'paiment!',
      message: 'vous <strong>confirmez</strong> le paiement?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'OUI',
          handler: async () => {
            this.order['cash'] = true;
            this.order['sale'] = true;
            this.order['partially'] = false;
            if (this.tabRoles.includes(4)) {
              try {
                typ = await this.notifi.typeDePaiement();
                console.log(typ);
              } catch (error) {}
            }
            this.order['paiment_type'] = typ[0];
            if (this.tabRoles.includes(9)) {
              //this.order['swConfirm'] = true;
              this.order['caisseConfirm'] = true;
            }
            if (this.tabRoles.includes(10)) {
              //this.order['swConfirm'] = true;
              this.order['saConfirm'] = true;
            }
            this.presentLoading2();
            if (this.resetValue > 0) {
              let tranche = {
                created: Date.now(),
                employeId: JSON.parse(localStorage.getItem('user'))['_id'],
                employeName: JSON.parse(localStorage.getItem('user'))['name'],
                montant: this.resetValue,
              };
              if (this.order['trancheList']) {
                this.order['trancheList'].push(tranche);
              } else {
                let tab = [];
                tab.push(tranche);
                this.order['trancheList'] = tab;
              }
              this.events
                .posStoreOrders(this.order, 'remove')
                .then((result) => {
                  this.dismissLoading();
                  this.modalController.dismiss({
                    status: 'ok ok',
                    invoice: this.order,
                  });
                  this.adminService
                    .makeAvanceOrder(this.order)
                    //  .pipe(takeUntil(this.destroy$))
                    .subscribe((res) => {
                      this.adminService
                        .buyOrder(this.order)
                        // .pipe(takeUntil(this.destroy$))
                        .subscribe((data) => {});
                    });
                });
            } else {
              this.order['montantR'] = this.check;
              this.events
                .posStoreOrders(this.order, 'remove')
                .then((res) => {
                  this.order['cash'] = true;
                  this.order['sale'] = true;
                  this.adminService
                    .buyOrder(this.order)
                    // .pipe(takeUntil(this.destroy$))
                    .subscribe((data) => {
                      this.dismissLoading();
                      this.modalController.dismiss({
                        status: 'ok ok',
                        invoice: this.order,
                      });
                    });
                })
                .catch((err) => {
                  this.dismissLoading();
                });
            }
          },
        },
      ],
    });

    await alert.present();
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

  openPDF(): void {
    let DATA = document.getElementById('printable-area');

    const divHeight = DATA.clientHeight;
    const divWidth = DATA.clientWidth;
    const options = { background: 'white', width: divWidth, height: divHeight };

    if (!this.platform.is('android') && !this.platform.is('ios')) {
      let myImage = '';
      domtoimage
        .toPng(DATA, options)
        .then((imgData) => {})
        .then(() => {
          domtoimage.toBlob(DATA, options).then((blob) => {
            var file = new File([blob], 'file_name', {
              lastModified: Date.now(),
            });
            var formData = new FormData();
            formData.append('image', file);
            console.log('formData here', formData);
            this.resApi.printInvoice(formData).subscribe((res) => {
              console.log(res);
            });
          });
        })

        .catch(function (error) {
          console.error('oops, something went wrong!', error);
        });
    }
  }
}
