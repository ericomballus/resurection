import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import {
  ModalController,
  AlertController,
  NavParams,
  Platform,
  LoadingController,
  PopoverController,
  // Events,
} from '@ionic/angular';
import { ManageCartService } from '../services/manage-cart.service';
import { CountItemsService } from '../services/count-items.service';
import { PrinterService } from '../services/printer.service';
import { log } from 'util';
import { AdminService } from '../services/admin.service';
import { TranslateConfigService } from '../translate-config.service';
import { zip, from, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfflineManagerService } from '../services/offline-manager.service';
import { NetworkService } from '../services/network.service';
import { HTTP } from '@ionic-native/http/ngx';
import { UrlService } from '../services/url.service';
//import { HTTP } from "@ionic-native/http/ngx";
import { environment, uri } from '../../environments/environment';
import { MyeventsService } from '../services/myevents.service';
import { Productmanager } from '../manage-cart/manageProducts';
import { ResourcesService } from '../services/resources.service';
import { PickCustomerPage } from '../pages/pick-customer/pick-customer.page';
import { ShopListService } from '../services/shop-list.service';
import { ServiceListService } from '../services/service-list.service';
import { SaverandomService } from '../services/saverandom.service';
import { NotificationService } from '../services/notification.service';
import { ConvertToPackService } from '../services/convert-to-pack.service';
import { MypopComponent } from '../popovers/mypop/mypop.component';
import { AddConsignePage } from '../pages/add-consigne/add-consigne.page';
import { TranslateService } from '@ngx-translate/core';
import { ChildBillService } from '../services/child-bill.service';
import { Setting } from '../models/setting.models';
import { ConfirmPage } from '../modals/confirm/confirm.page';
import { Product } from '../models/product.model';
import { Admin } from '../models/admin.model';
import { SelectPatientPage } from '../hospital/select-patient/select-patient.page';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  @ViewChild('myBill', { static: false }) public myBill: ElementRef;
  allCart: any;
  commande: boolean = false;
  resourceTab = [];
  tab = [];
  total = 0;
  totalPrice = 0;
  tabToPrint = [];
  tabRoles = [];
  plat = [];
  printAutorisation: boolean = false;
  totalAmount = 0;
  montantReduction = 0;
  reste = 0;
  inputvalue = 0;
  url: string = 'http://192.168.100.10:3000/';
  manageStockWithService: Boolean = false;
  uri2;
  isLoading = false;
  customer: any;
  isRetailer = false;
  // consigneTab: any;
  commandeResume;
  checkPack = false;
  voucher: any;
  useBonus = false;
  reduction = 0;
  order2: any;
  longueurLigne = 0;
  totalArticle = 0;
  totalArticleBTL = 0;
  totalArticleCA = 0;
  consigneTab = [];
  employePercentPrice = false;
  employe = null;
  employeList: any[] = [];
  setting: Setting;
  enterPrice = true;
  useCustomerSolde = false;
  zoneList: any[] = [];
  desableBtn = false;
  bottle_return = false;
  randomObj = {};
  admin: Admin;
  constructor(
    public restApiService: RestApiService,
    private modalController: ModalController,
    public alertController: AlertController,
    public manageCartService: ManageCartService,
    public countItemsService: CountItemsService,
    // public events: MyeventsService,
    private printService: PrinterService,
    private adminService: AdminService,
    navParams: NavParams,
    private httpN: HTTP,
    private translateConfigService: TranslateConfigService,
    private networkService: NetworkService, // private http: HTTP
    private urlService: UrlService,
    private events: MyeventsService,
    private platform: Platform,
    public loadingController: LoadingController,
    public resourceService: ResourcesService,
    private shoplistService: ShopListService,
    private servicelistService: ServiceListService,
    private saveRandom: SaverandomService,
    private notifi: NotificationService,
    private convert: ConvertToPackService,
    public translate: TranslateService,
    private childBill: ChildBillService
  ) {
    // (navParams.get("commande"));
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.plat = JSON.parse(localStorage.getItem('plat'));
    if (this.tabRoles.includes(8)) {
      this.enterPrice = false;
      console.log('enter price====>', this.enterPrice);
    }

    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(5) ||
      this.tabRoles.includes(4)
    ) {
      this.printAutorisation = true;
    }
    let setting = JSON.parse(localStorage.getItem('setting'));
    this.setting = this.saveRandom.getSetting();

    if (this.saveRandom.getCustmer()) {
      this.customer = this.saveRandom.getCustmer();
      this.desableBtn = true;

      if (this.tabRoles.includes(8)) {
        this.setting = this.saveRandom.getSetting();
        this.setting.register_customer = false;
      }
    }

    if (this.tabRoles.includes(9)) {
      setting = this.saveRandom.getSetting();
      this.enterPrice = true;
    }
    if (setting.use_bonus) {
      this.useBonus = true;
    }
    if (setting.employePercentPrice) {
      this.employePercentPrice = true;
      this.employeList = this.saveRandom.getEmployeList();
    }
    if (setting.length) {
      this.manageStockWithService = setting[0]['manageStockWithService'];
    } else {
      if (setting['manageStockWithService']) {
        setting['manageStockWithService'];

        this.manageStockWithService = setting['manageStockWithService'];
      }
    }

    this.languageChanged();
    if (navParams.get('commande')) {
      // (navParams.get('commande'));

      this.commande = true;
      this.commandeResume = this.saveRandom.getResumePurchase();
    }
    this.takeCart();

    this.takeUrl();
  }

  ionViewWillEnter() {
    if (this.tabRoles.includes(8)) {
      this.enterPrice = false;
      console.log('enter price hello ====>', this.enterPrice);
    }
    this.bottle_return = false;
    this.admin = this.saveRandom.getAdminAccount();
  }

  ngOnInit() {
    this.languageChanged();
    this.checkIfSaleToPAck();
    this.voucher = this.saveRandom.getVoucher();
    if (this.voucher) {
      this.montabtPercu(this.voucher.price);
    }
    this.setting = this.saveRandom.getSetting();
    if (this.setting.zone) {
      this.zoneList = this.setting.zone;
    }
    if (this.saveRandom.checkIfIsRetailer()) {
      this.isRetailer = true;
      this.customer = this.saveRandom.getRetailer();
    }
  }

  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        // ("url", this.url);
      });
    } else {
      this.url = uri;
    }
    this.urlService.getUrlEvent().subscribe(async (data) => {
      this.uri2 = data;
    });
  }

  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  async selectCustomer() {
    if (this.tabRoles.includes(5)) {
      this.notifi.presentToast(
        'vous ne pouvez pas utiliser cette option, rapprocher vous de la caisse',
        'danger'
      );
      return;
    }

    const modal = await this.modalController.create({
      component: PickCustomerPage,
      cssClass: 'mymodal-class',
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {
      if (res['data']['customer']) {
        this.customer = res['data']['customer'];
        console.log(this.customer);
      }
      if (res['data']['chefEquipe']) {
        let chef = res['data']['chefEquipe'];
        this.reduction = chef['reduction'];
        this.customer['reduction'] = chef['reduction'];
        this.totalAmount =
          this.totalAmount - (this.totalAmount * this.reduction) / 100;
        //this.customer
      } else if (res['data']['customer']) {
        let customer = res['data']['customer'];

        if (customer.reduction) {
          this.totalAmount = this.allCart.cart.totalPrice;
          this.totalAmount =
            this.totalAmount - (this.totalAmount * customer.reduction) / 100;
          this.montantReduction = this.totalAmount;
          if (this.saveRandom.getZone()) {
            this.saveRandom.calculDhl(this.setting, this.montantReduction);
          }
          // this.employe = employe;
        }
      }
      if (this.customer && this.customer['solde'] >= this.totalAmount) {
        this.notifi
          .presentAlertConfirm(
            `le client ${this.customer.name} a un montant en solde de : ${this.customer.solde}, payer a partir du solde ?`,
            'OUI',
            'NON'
          )
          .then(() => {
            this.inputvalue = this.totalAmount;
            this.reste = this.inputvalue - this.totalAmount;
            this.useCustomerSolde = true;
          })
          .catch(() => {});
      }
    });

    return await modal.present();
  }
  async selectPatient() {
    if (this.tabRoles.includes(5)) {
      this.notifi.presentToast(
        'vous ne pouvez pas utiliser cette option, rapprocher vous de la caisse',
        'danger'
      );
      return;
    }

    const modal = await this.modalController.create({
      component: SelectPatientPage,
      cssClass: 'mymodal-class',
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {
      if (res['data']['customer']) {
        this.customer = res['data']['customer'];
        console.log(this.customer);
      }
      if (res['data']['chefEquipe']) {
        //this.customer
      } else if (res['data']['customer']) {
        let customer = res['data']['customer'];

        if (customer.reduction) {
          this.totalAmount = this.allCart.cart.totalPrice;
          this.totalAmount =
            this.totalAmount - (this.totalAmount * customer.reduction) / 100;
          this.montantReduction = this.totalAmount;
          if (this.saveRandom.getZone()) {
            this.saveRandom.calculDhl(this.setting, this.montantReduction);
          }
          // this.employe = employe;
        }
      }
      if (this.customer && this.customer['solde'] >= this.totalAmount) {
        this.notifi
          .presentAlertConfirm(
            `le client ${this.customer.name} a un montant en solde de : ${this.customer.solde}, payer a partir du solde ?`,
            'OUI',
            'NON'
          )
          .then(() => {
            this.inputvalue = this.totalAmount;
            this.reste = this.inputvalue - this.totalAmount;
            this.useCustomerSolde = true;
          })
          .catch(() => {});
      }
    });

    return await modal.present();
  }
  selectEmploye(ev) {
    let selected = Array.apply(null, ev.options) // convert to real Array
      .filter((option) => option.selected)
      .map((option) => option.value);

    let id = selected[0];
    let employe = this.employeList.find((empl) => {
      return empl._id == id;
    });
    console.log(employe);
    if (employe && employe.percentage) {
      {
        this.totalAmount = this.allCart.cart.totalPrice;
        this.totalAmount =
          this.totalAmount - (this.totalAmount * employe.percentage) / 100;
        this.montantReduction = this.totalAmount;
        this.employe = employe;
      }
    }
    console.log(this.allCart);
  }
  takeCart() {
    this.totalAmount = 0;
    this.restApiService.getCart().subscribe((data) => {
      if (
        !data ||
        (Object.keys(data).length === 0 && data.constructor === Object)
      ) {
        return;
      } else {
        this.tab = data['products'];
        if (data['cart'] && data['cart']['totalPrice']) {
          this.totalPrice = data['cart']['totalPrice'];
        }

        if (this.tab && this.tab.length) {
          this.tab.forEach((elt) => {
            if (elt.item['noRistourne']) {
              elt.item['noRistourne'] = elt.item['noRistourne'];
            } else {
              elt.item['noRistourne'] = false;
            }
            if (
              elt['item']['resourceList'] &&
              elt['item']['resourceList'].length
            ) {
              this.total = this.total + elt['qty'];

              this.resourceTab = this.resourceTab.concat(
                //  elt["item"]["resourceList"]
                elt['item']
              );
            } else {
              ('rien');
            }
          });
        }

        //(this.resourceTab);

        if (this.tab && this.tab.length) {
          this.tab.forEach((elt) => {
            let obj = {
              name: elt['item']['name'],
              price: elt['price'],
              total: elt['qty'],
            };
            this.tabToPrint.push(obj);
          });
        }
        //  (this.tabToPrint);

        this.allCart = data;

        if (this.allCart['cart'] && this.allCart['cart']['totalPrice']) {
          this.totalAmount = this.allCart['cart']['totalPrice'];
        }
      }
    });
  }

  async removeOneItem(prod) {
    this.tabToPrint = [];
    let result = await this.manageCartService.removeOneToCart(
      prod.item._id,
      this.allCart['cart']
    );

    this.allCart = result;
    this.totalAmount = this.allCart['totalPrice'];
    this.totalPrice = result['cart']['totalPrice'];
    let tab = result['products'];
    tab.forEach((elt) => {
      let obj = {
        name: elt['item']['name'],
        price: elt['price'],
        total: elt['qty'],
      };
      this.tabToPrint.push(obj);
    });
  }

  async removeOne(prod, mode?) {
    if (mode === 'modeG') {
      this.events.removeOne(prod['item'], 'modeG');
      this.totalAmount = this.totalAmount - prod.item.sellingPrice;
    } else if (mode === 'modeNG') {
      this.events.removeOne(prod['item'], 'modeNG');
      this.totalAmount = this.totalAmount - prod.item.sellingPrice;
    } else if (mode === 'CA') {
      this.events.removeOne(prod['item'], 'CA');
      this.totalAmount = this.totalAmount - prod.item.sellingPackPrice;
    } else if (mode === 'BTL') {
      this.events.removeOne(prod['item'], 'BTL');
      this.totalAmount = this.totalAmount - prod.item.sellingPrice;
    } else {
      console.log('hello342', prod);

      this.events.removeOne(prod);
      this.totalAmount = this.totalAmount - prod.item.sellingPrice;
      if (this.plat && this.plat.length) {
        this.plat;
        if (prod['item']['productType'] == 'manufacturedItems') {
          this.plat.forEach((p) => {
            if (p['produit']['_id'] === prod['item']['_id']) {
              if (parseInt(p['nbr'])) {
                p['nbr'] = p['nbr'] - 1;
              }
            }
          });
        }
      }
    }
  }

  async removeAllItem(prod) {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Remove All?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            // ("Confirm Cancel: blah");
          },
        },
        {
          text: 'YES',
          handler: () => {
            this.manageCartService;
            this.allCart = this.manageCartService.removeOneAllToCart(
              prod.item._id,
              this.allCart['cart']
            );

            // ("aftert delete", this.allCart);
          },
        },
      ],
    });

    await alert.present();
  }

  async addOneItem(prod) {
    prod;
    if (prod.item.quantityStore > 0) {
      this.tabToPrint = [];
      let data = {};
      data['product'] = prod['item'];
      data['cart'] = this.allCart['cart'];
      let result = await this.manageCartService.addToCart(data);
      this.totalAmount = result['totalPrice'];
      this.allCart = { cart: result, products: result.generateArray() };
      this.totalPrice = result['totalPrice'];
      let tab = this.allCart['products'];
      tab.forEach((elt) => {
        let obj = {
          name: elt['item']['name'],
          price: elt['price'],
          total: elt['qty'],
        };
        this.tabToPrint.push(obj);
      });
    } else {
      return;
    }
  }

  async addOne(prod, mode?) {
    if (
      prod.item.quantityStore > 0 &&
      prod.item.productType === 'productItems'
    ) {
      if (mode === 'modeG') {
        if (prod.item.glace > 0) {
          this.events.addOne(prod['item'], prod.item.glace, 'G');
          // this.totalAmount = this.totalAmount + prod.item.sellingPrice;
          return;
        }
      } else if (mode === 'CA') {
        this.events.addOne(prod['item'], prod.item.CA, 'CA');
        //  this.totalAmount = this.totalAmount + prod.item.sellingPackPrice;
      } else if (mode === 'BTL') {
        this.events.addOne(prod['item'], prod.item.BTL, 'BTL');
        //  this.totalAmount = this.totalAmount + prod.item.sellingPrice;
      } else if (mode === 'modeNG') {
        this.events.addOne(prod['item'], prod.item.modeNG, 'NG');
        //  this.totalAmount = this.totalAmount + prod.item.sellingPrice;
      }
    } else {
      this.events.addOne(prod['item']);
    }
  }

  closeModal() {
    this.modalController.dismiss(this.allCart);
    this.saveRandom.setVoucher(null);
  }

  async afterBuyItems() {
    if (this.tabRoles.includes(8)) {
      if (this.saveRandom.getZone()) {
        this.openConfirmPage();
      } else {
        this.notifi
          .presentAlertConfirm(
            "vous n'avez pas choisis la zone du client continuer quand meme ?",
            'OUI',
            'NON'
          )
          .then(() => {
            this.openConfirmPage();
          })
          .catch(() => {});
      }
    } else {
      this.openConfirmPage();
    }
  }

  async openConfirmPage() {
    let numeroTable = 1;
    let a: any = {};
    this.translate.get('MENU.confirmInvoice').subscribe((t) => {
      a['confirmInvoice'] = t;
    });
    this.translate.get('MENU.cancel').subscribe((t) => {
      a['cancel'] = t;
    });
    this.translate.get('MENU.ok').subscribe((t) => {
      a['ok'] = t;
    });
    this.translate.get('MENU.no').subscribe((t) => {
      a['no'] = t;
    });
    if (this.setting && this.setting.use_TableNumber) {
      let numero: any = await this.getTableNumber(a);
      console.log('nummm', numero);
      if (numero) {
        numeroTable = numero;
      }

      this.invoicePrebuild(numeroTable, a);
    } else {
      this.invoicePrebuild(numeroTable, a);
    }
  }

  async buyItems(tableNumber) {
    if (
      (this.tabRoles.includes(9) && this.inputvalue < this.totalAmount) ||
      (this.tabRoles.includes(9) && this.inputvalue == 0)
    ) {
      this.notifi.presentToast(
        'le montant reçu est plus petit que le montant de la facture',
        'danger'
      );
      return;
    }
    this.notifi.presentLoading();
    let resource = [];
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    // this.restApiService.getCart().subscribe((data) => {
    let data = this.allCart;

    if (this.saveRandom.checkIfUsePack()) {
      data['products'] = await this.convert.convertBeforeSending(
        data['products']
      );
    }

    let lacommande = {
      products: data['products'],
      cartdetails: data['cart'],
      // totalPrice: data["cart"]["totalPrice"],
      //  totalQty: data["cart"]["totalQty"],
      trancheList: [],
    };

    if (this.customer) {
      lacommande['customer'] = this.customer;
    }
    if (this.employe) {
      lacommande['employe'] = this.employe;
    }
    if (this.useBonus && this.customer['chefEquipe']) {
    }
    if (this.inputvalue) {
      lacommande['reste'] = this.reste;
      lacommande['montantRecu'] = this.inputvalue;
      let tranche = {
        created: Date.now(),
        employeId: JSON.parse(localStorage.getItem('user'))['_id'],
        employeName: JSON.parse(localStorage.getItem('user'))['name'],
        montant: this.inputvalue,
      };
      lacommande['trancheList'].push(tranche);
    } else {
      lacommande['montantRecu'] = 0;
      lacommande['reste'] = -this.totalAmount;
    }
    if (this.resourceTab) {
      resource = this.resourceTab;
    }
    if (this.plat && this.plat.length) {
      lacommande['plat'] = this.plat;
    }
    lacommande['montantReduction'] = this.montantReduction;

    if (
      JSON.parse(localStorage.getItem('order'))
      //  && JSON.parse(localStorage.getItem("order"))["localId"]
    ) {
      //add to exist invoices
      if (tabRoles.includes(5)) {
        this.addOrders(lacommande, tableNumber, resource);
        return;
      }
      if (tabRoles.includes(4)) {
        let oldOrder = JSON.parse(localStorage.getItem('order'));

        let obj2 = {
          products: lacommande['products'],
          cartdetails: lacommande['cartdetails'],
          montantRecu: lacommande['montantRecu'],
        };

        oldOrder['commandes'].push(obj2);
        // oldOrder["products"]= oldOrder["products"]
        let newOrder = oldOrder;
        newOrder['cart'] = lacommande;
        newOrder['commande'] = lacommande;
        newOrder['localId'] = oldOrder.localId;
        //  newOrder["adminId"] = id;

        if (
          this.platform.is('desktop') ||
          this.platform.is('electron') ||
          this.platform.is('mobileweb')
        ) {
          this.restApiService.commandeAdd(newOrder).subscribe((data) => {
            localStorage.removeItem('order');
            this.allCart['products'] = [];
            this.modalController.dismiss('update');
          });
        } else {
          this.posAddOrders(lacommande, tableNumber, resource);
        }

        return;
      }
    } else {
      if (this.saveRandom.getVoucher()) {
        this.saveRandom.setData(lacommande);
        (lacommande['confirm'] = true),
          (lacommande['userName'] = JSON.parse(localStorage.getItem('user'))[
            'name'
          ]),
          (lacommande['billId'] = this.saveRandom.getVoucher().billId);
        lacommande['purchaseOrderId'] = this.saveRandom.getVoucher()._id;
      }
      if (
        tabRoles.includes(4) ||
        tabRoles.includes(2) ||
        tabRoles.includes(8) ||
        tabRoles.includes(9)
      ) {
        let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];

        if (
          this.platform.is('mobileweb') ||
          this.platform.is('desktop') ||
          this.platform.is('electron') ||
          this.platform.is('pwa') ||
          this.platform.is('android')
        ) {
          let idL =
            Math.random()
              .toString(36)
              .replace(/[^a-z]+/g, '')
              .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
          idL = idL + Date.now().toString();
          lacommande['localId'] = idL;
          lacommande['storeId'] = storeId;
          if (this.consigneTab && this.consigneTab.length) {
            lacommande['consigne'] = this.consigneTab;
          }
          if (this.useCustomerSolde) {
            lacommande['useCustomerSolde'] = true;
            lacommande['customer'] = this.customer;
          } else {
            lacommande['useCustomerSolde'] = false;
          }
          if (
            //this.saveRandom.getSetting().use_bonus
            // this.saveRandom.getSetting() &&
            // this.saveRandom.getSetting().use_gamme &&
            lacommande['montantRecu'] >= this.totalAmount
          ) {
            // this.notifi.dismissLoading();
            // await this.confirmPaiement(lacommande);
            //   await this.confirmLivraison(lacommande);
            lacommande['reste'] = lacommande['montantRecu'] - this.totalAmount;
            //  this.notifi.presentLoading();
          }
          if (this.saveRandom.getVoucher()) {
            this.postChildInvoice(lacommande); //je crée la facture enfant
          } else {
            // this.notifi.presentLoading();
            this.restApiService
              .commande(lacommande, tableNumber, resource)
              .subscribe(
                async (data) => {
                  if (data['check']) {
                    this.notifi.dismissLoading();
                    this.events.newOrder(null);
                    this.modalController.dismiss({ order: data });
                    // this.modalController.dismiss('update');
                    // this.confirmAndPrint(data);
                  } else {
                    this.events.newOrder(data);
                    this.events
                      .posStoreOrders(data, 'store')
                      .then(async (res) => {
                        this.saveRandom.setVoucher(null);
                        this.notifi.dismissLoading();
                        //  this.allCart['products'] = [];
                        this.customer = null;
                        this.modalController.dismiss('update');
                      });
                  }
                },
                (err) => {
                  console.log('il ya erreur ici===>', err);
                }
              );
          }
        }
      } else if (
        tabRoles.includes(2) &&
        !tabRoles.includes(4) &&
        this.manageStockWithService
      ) {
        if (this.consigneTab && this.consigneTab.length) {
          lacommande['consigne'] = this.consigneTab;
        }
        let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
        let idL =
          Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
        idL = idL + Date.now().toString();
        lacommande['localId'] = idL;
        lacommande['storeId'] = storeId;
        this.restApiService
          .commande(lacommande, tableNumber, resource)
          .subscribe((data) => {
            data;
            this.customer = null;
            this.allCart['products'] = [];
            this.modalController.dismiss('update');
          });
      } else {
        let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
        lacommande['storeId'] = storeId;
        this.sendCommande(lacommande, tableNumber, resource);
      }
    }
    //});
  }

  removeAll() {
    this.allCart = undefined;
    this.events.refresh();
    this.modalController.dismiss('update-cancel');
  }

  async updateProd() {
    try {
      await this.notifi.presentAlertConfirm(
        `vous confirmez l'achat ?`,
        'OUI',
        'NON'
      );
      if (this.saveRandom.getSetting().sale_Gaz) {
        try {
          let response = await this.notifi.presentAlertConfirm(
            'achat avec retour des bouteilles vides?',
            'YES',
            'NO'
          );
          this.bottle_return = true;
        } catch (error) {
          this.bottle_return = false;
        }
      }
      if (this.saveRandom.checkIfIsRetailer()) {
        this.giveToRetailer(0);
      } else {
        this.presentLoading2();
        let quantity = 0;
        let totalPrice = 0;
        let tab = [];
        let totalPirce = 0;
        tab = this.allCart['products'];

        quantity =
          this.commandeResume.totalItems + this.commandeResume.totalBtl;
        totalPirce = this.commandeResume.totalPrice;
        let tabProd = [];
        let tabPack = [];
        let tabResto = [];
        let tabResource = [];
        let tabShopList = [];
        let tabServiceList = [];
        for (let i = 0; i < tab.length; i++) {
          let obj = {};

          if (tab[i]['item']['thetype']) {
            tabPack.push(tab[i]['item']);
          }

          if (tab[i]['item']['nbrBtl']) {
          } else if (tab[i]['item']['resourceType']) {
            obj = {
              newquantity: tab[i]['qty'],
              // *tab[i]["item"]["sizeUnit"],
              id: tab[i]['item']['_id'],
            };
          } else {
            obj = {
              newquantity: tab[i]['qty'],
              id: tab[i]['item']['_id'],
              storeId: tab[i]['item']['storeId'],
              name: tab[i]['item']['name'],
              item: tab[i]['item'],
              price: tab[i]['price'],
            };
            if (this.saveRandom.getSetting().sale_Gaz) {
              let storeId = tab[i]['item']['storeId'];
              if (this.randomObj[storeId]) {
                console.log(this.randomObj);

                this.randomObj[storeId]['total'] =
                  this.randomObj[storeId]['total'] + tab[i]['price'];
              } else {
                this.randomObj[storeId] = { total: tab[i]['price'] };
              }
            }
          }

          if (
            tab[i]['item']['productType'] &&
            tab[i]['item']['productType'] == 'manufacturedItems'
          ) {
            tabResto.push(obj);
          }
          if (tab[i]['item']['thetype']) {
          } else if (tab[i]['item']['resourceType']) {
            tabResource.push(obj);
          } else if (
            tab[i]['item']['productType'] &&
            tab[i]['item']['productType'] == 'shoplist'
          ) {
            tabShopList.push(obj);
          } else if (
            tab[i]['item']['productType'] &&
            tab[i]['item']['productType'] == 'billard'
          ) {
            tabServiceList.push(obj);
          } else {
          }
        }

        // let resultat: Array<any>;
        if (!this.saveRandom.getSetting().refueling_from_warehouse_production) {
          if (tabPack.length) {
            await this.sendPackToServer(tabPack, []);
          } else {
            this.sendProductToServer(tabProd);
          }
          if (tabResto.length) {
            await this.sendProductRestoToServer(tabResto);
          }

          if (tabResource.length) {
            await this.sendResourceToServer(tabResource);
          }

          if (tabShopList.length) {
            await this.sendShopListToServer(tabShopList);
          }

          if (tabServiceList.length) {
            await this.sendServiceListToServer(tabServiceList);
          }
        }
        let storeId = 'supermanager';
        let senderId = '';
        let user = this.saveRandom.getUserCredentail();
        if (user) {
          senderId = user._id;
        }

        if (this.saveRandom.getSuperManager()) {
          ///  storeId = 'supermanager';
        } else {
          storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
        }
        storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
        let data = {
          articles: this.allCart,
          quantity:
            this.commandeResume.totalItems + this.commandeResume.totalBtl,
          totalPrice: this.commandeResume.totalPrice,
          storeId: storeId,
          senderId: senderId,
        };

        this.adminService.sendPurchase(data).subscribe(
          (res) => {
            this.updateBudgetBystore();
            this.dismissLoading();
            this.notifi.presentToast(
              'votre commande a été transmise !',
              'primary'
            );
            this.modalController.dismiss('update');
          },
          (err) => {
            this.modalController.dismiss();
          }
        );
      }
    } catch (error) {}
  }
  async updateBudgetBystore() {
    if (this.randomObj) {
      for (const id in this.randomObj) {
        let store = await this.foundStore(id);
        if (store && store['budget']) {
          let s = await this.setBudgetAndUpdate(
            store,
            this.randomObj[id]['total']
          );
          this.updateWithoutExit(s);
        }
      }
    }
  }
  foundStore(id) {
    return new Promise((resolve, reject) => {
      let s: any[] = this.admin.storeId;
      let f = s.find((elt) => elt.id == id);
      if (f) {
        resolve(f);
      } else {
        reject(null);
      }
    });
  }
  setBudgetAndUpdate(store, totalPrice) {
    return new Promise((resolve, reject) => {
      if (store['reste']) {
        store.reste = store.reste - totalPrice;
      } else {
        store['reste'] = store.budget - totalPrice;
      }
      resolve(store);
    });
  }
  updateWithoutExit(store) {
    let storeList = this.admin.storeId;
    let index = storeList.findIndex((s) => s.id == store.id);
    if (index >= 0) {
      this.admin.storeId.splice(index, 1, store);
      this.adminService.updateCustomer(this.admin).subscribe(
        (data) => {
          let admin = data['resultat'];
          if (admin) {
            let arr = [];
            arr.push(admin);
            let s = { count: 1, users: arr };
            localStorage.removeItem('credentialAccount');
            localStorage.setItem('credentialAccount', JSON.stringify(s));
          }
        },
        (err) => console.log(err)
      );
    }
  }

  sendPackToServer(tabPack, tabProd) {
    return new Promise((resolve, reject) => {
      tabPack.forEach((elt) => {
        let nbr = 0;
        if (elt['nbrBtl']) {
          nbr = nbr + elt['nbrBtl'];
        }

        if (elt['nbrCassier']) {
          nbr = nbr + elt['nbrCassier'] * elt['sizePack'];
        }

        let obj = {
          newquantity: nbr,
          id: elt.productItemId,
          // noRistourne: elt.noRistourne,
        };
        tabProd.push(obj);
      });
      this.restApiService.updateMoreProductItem({ tab: tabProd }).subscribe(
        (data) => {
          resolve('ok');
        },
        (err) => console.log(err)
      );
    });
  }

  sendProductToServer(tabProd) {
    return new Promise((resolve, reject) => {
      this.restApiService
        .updateMoreProductItem({ tab: tabProd })
        .subscribe((data) => {
          resolve('ok');

          // tabProd.forEach((elt) => {
        });
    });
  }
  sendProductRestoToServer(tabResto) {
    return new Promise((resolve, reject) => {
      let cmp = 0;
      let i = tabResto.length;
      if (tabResto.length) {
        let pro = zip(from(tabResto), interval(500)).pipe(
          map(([prod]) => prod)
        );
        pro.subscribe((data) => {
          this.EnvoiManufactured(data);
          cmp = cmp + 1;
          if (cmp >= i) {
            setTimeout(() => {
              resolve('ok');
            }, 200);
          }
        });
      }
    });
  }

  EnvoiManufactured(data) {
    this.restApiService.updateManufacturedItem(data).subscribe((res) => {});
  }

  envoiLaResource(data) {
    this.resourceService
      .updateResourceItemQuantity(data)
      .subscribe((res) => {});
  }
  //
  sendShopList(data, product?: Product) {
    this.shoplistService.updateShopItemQuantity(data).subscribe((res) => {
      if (product) {
        this.restApiService.updateShopList(product).subscribe((data) => {
          console.log('product update here===>', data);
        });
      }
    });
  }
  sendServiceList(data) {
    this.servicelistService
      .updateServiceItemQuantity(data)
      .subscribe((res) => {});
  }
  updateProductItem(obj) {
    this.restApiService.updateProductItem(obj).subscribe(
      (data) => {
        //(data);
      },
      (err) => {}
    );
  }

  sendResourceToServer(tabResource) {
    if (tabResource.length) {
      let pro = zip(from(tabResource), interval(500)).pipe(
        map(([prod]) => prod)
      );
      pro.subscribe((data) => {
        this.envoiLaResource(data);
      });
    }
  }

  sendServiceListToServer(tabServiceList) {
    if (tabServiceList.length) {
      let pro = zip(from(tabServiceList), interval(500)).pipe(
        map(([prod]) => prod)
      );
      pro.subscribe((data) => {
        console.log('hello====', data);
        this.sendServiceList(data);
      });
    }
  }
  sendShopListToServer(tabShopList) {
    if (tabShopList.length) {
      let pro = zip(from(tabShopList), interval(500)).pipe(
        map(([prod]) => prod)
      );
      pro.subscribe((data) => {
        if (this.saveRandom.getSetting().sale_Gaz) {
          data['bottle_return'] = this.bottle_return;
          console.log('send here', data);
        }
        this.sendShopList(data);
        /* if (this.saveRandom.getSetting().sale_Gaz) {
          let product: Product = data['item'];
          if (
            product.bottle_empty &&
            product.bottle_empty - data['newquantity'] > 0
          ) {
            product.bottle_empty = product.bottle_empty - data['newquantity'];
          } else {
            product.bottle_empty = 0;
          }
          if (product.bottle_full) {
            product.bottle_full = product.bottle_full + data['newquantity'];
          } else {
            product.bottle_full = data['newquantity'];
          }
          product.bottle_total = product.bottle_full + product.bottle_empty;
          this.sendShopList(data, product);
        } else {
          this.sendShopList(data);
        }*/
      });
    }
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
    if (ev.detail) {
      this.inputvalue = parseInt(ev.detail.value);
      this.inputvalue = parseInt(ev.detail.value);
      this.reste = parseInt(ev.detail.value) - this.totalAmount;
    } else {
      this.inputvalue = ev;
      this.reste = ev - this.totalAmount;
    }
  }
  sendCommande(items, tableNumber, resource?) {
    let confirm = false;
    let Posconfirm = false;
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let openCashDate = localStorage.getItem('openCashDate');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    items['storeId'] = storeId;
    let database = localStorage.getItem('adminemail');
    let idL =
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
    idL = idL + Date.now().toString();
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];

    if (tabRoles.includes(4)) {
      (confirm = true), (Posconfirm = true);
    }
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    let adminId = localStorage.getItem('adminId');

    let table = [];
    table.push(items);
    let totalPrice = parseInt(items.cartdetails.totalPrice);
    let data = {
      cart: items,
      commande: items,
      commandes: table,
      totalPrice: items['totalPrice'],
      adminId: adminId,
      tableNumber: tableNumber,
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
      resourceList: resource,
      userName: userName,
      products: items['products'],
      localId: idL,
      sale: false,
      senderId: senderId,
      storeId: storeId,
      montantReduction: items['montantReduction'],
    };
    let obj = JSON.stringify(data);

    let url =
      this.url +
      'invoice/commande/items/' +
      userName +
      '/' +
      adminId +
      '/' +
      '?db=' +
      adminId;
    let setiing = JSON.parse(localStorage.getItem('setting'));
    if (setiing['use_desktop']) {
      this.restApiService.commandeFree(data).subscribe((res) => {
        this.events.storeOrders(data, 'save', []).then((res) => {
          this.allCart['products'] = [];
          this.customer = null;
          this.modalController.dismiss('update');
        });
      });
    } else {
      this.httpN.setDataSerializer('utf8');
      this.httpN
        .post(url, obj, {})
        .then((response) => {
          let res = JSON.parse(JSON.stringify(response));
          let commande = JSON.parse(res['data']);
          commande['commandes'] = table;
          //commande["Posconfirm"] = true;
          this.notifi.dismissLoading();
          this.events.storeOrders(commande, 'save', []).then((res) => {
            this.allCart['products'] = [];
            this.customer = null;
            this.modalController.dismiss('update');
          });
        })
        .catch((error) => {
          alert(JSON.stringify(error));
          this.allCart['products'] = [];
          this.modalController.dismiss('update');
        });
    }
  }

  posSendCommande(items, tableNumber, resource?) {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    let confirm = true;
    let Posconfirm = true;
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let openCashDate = localStorage.getItem('openCashDate');
    let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
      '_id'
    ];
    let database = localStorage.getItem('adminemail');
    let idL =
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
    let senderId = JSON.parse(localStorage.getItem('user'))['_id'];

    if (tabRoles.includes(4)) {
      (confirm = true), (Posconfirm = true);
    }
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    let adminId = localStorage.getItem('adminId');
    let numFacture;
    if (parseInt(localStorage.getItem('numFacture'))) {
      numFacture = parseInt(localStorage.getItem('numFacture')) + 1;
      localStorage.setItem('numFacture', numFacture);
    } else {
      numFacture = 1;
      localStorage.setItem('numFacture', '1');
    }
    let table = [];
    table.push(items);
    let data = {
      cart: items,
      commande: items,
      commandes: table,
      adminId: adminId,
      tableNumber: tableNumber,
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
      resourceList: resource,
      userName: userName,
      products: items['products'],
      //numFacture: numFacture,
      localId: idL,
      sale: false,
      senderId: senderId,
      storeId: storeId,
      isRetailer: items['isRetailer'],
      montantReduction: items['montantReduction'],
    };
    if (this.consigneTab && this.consigneTab.length) {
      data['consigne'] = this.consigneTab;
    }
    let obj = JSON.stringify(data);

    let url =
      //"127.0.0.1:3000/" +
      'http://127.0.0.1:3000/' +
      'invoice/commande/items/' +
      userName +
      '/' +
      adminId +
      '/' +
      '?db=' +
      adminId;
    this.httpN.setDataSerializer('utf8');
    this.httpN
      .post(url, obj, {})
      .then((response) => {
        this.notifi.dismissLoading();
        this.customer = null;
        this.allCart['products'] = [];
        this.modalController.dismiss('update');
      })
      .catch((error) => {
        this.notifi.dismissLoading();
        this.allCart['products'] = [];
        this.modalController.dismiss('update');
      });
  }

  addOrders(items, tableNum, resource) {
    const id = localStorage.getItem('adminId');
    let database = localStorage.getItem('adminemail');
    let oldOrderId = JSON.parse(localStorage.getItem('order'))['localId'];
    let oldOrder = JSON.parse(localStorage.getItem('order'));
    let tabRoles = JSON.parse(localStorage.getItem('roles'));

    let obj2 = {
      products: items['products'],
      cartdetails: items['cartdetails'],

      totalQty: items['totalQty'],
      montantRecu: items['montantRecu'],
      totalPrice:
        parseInt(items['totalPrice']) + parseInt(oldOrder['totalPrice']),
    };

    oldOrder['commandes'].push(obj2);
    let newOrder = oldOrder;
    newOrder['cart'] = items;
    newOrder['commande'] = items;
    newOrder['adminId'] = id;
    let tab2 = [];
    let total = 0;
    newOrder['commandes'].forEach((com) => {
      total = total + parseInt(com['cartdetails']['totalPrice']);
    });
    newOrder['totalPrice'] = total;
    tab2 = JSON.parse(localStorage.getItem(`allCommande`));

    if (tab2 && tab2.length) {
      let index2 = tab2.findIndex((elt) => {
        return elt.localId === oldOrderId;
      });
      if (index2 >= 0) {
        tab2.splice(index2, 1, newOrder);
        //localStorage.setItem(`allCommande`, JSON.stringify(tab2));
      }
    }
    let uri = this.url + 'invoice/add/newinvoice/to/old' + '?db=' + id;

    newOrder['url'] = this.url;
    newOrder['add'] = 1;
    let setiing = JSON.parse(localStorage.getItem('setting'));
    if (setiing['use_desktop']) {
      this.restApiService.commandeAdd(newOrder).subscribe((res) => {
        this.events.newInvoices(newOrder);
        localStorage.removeItem('order');
        localStorage.removeItem('addFlag');
        this.allCart['products'] = [];
        this.modalController.dismiss('update');
      });
    } else {
      let obj = JSON.stringify(newOrder);

      this.httpN.setDataSerializer('utf8');
      this.httpN
        .post(uri, obj, {})
        .then((response) => {
          this.events
            .storeOrders(oldOrderId, 'addInOrder', newOrder)
            .then((data) => {
              this.events.newInvoices(newOrder);
              localStorage.removeItem('order');
              localStorage.removeItem('addFlag');
              this.allCart['products'] = [];
              this.modalController.dismiss('update');
            })
            .catch((err) => {
              alert(err);
              localStorage.removeItem('order');
              localStorage.removeItem('addFlag');
              this.allCart['products'] = [];
              this.modalController.dismiss('update');
            });
        })
        .catch((error) => {
          alert(JSON.stringify(error));

          localStorage.removeItem('order');
        });
    }
  }

  posAddOrders(items, tableNum, resource) {
    const id = localStorage.getItem('adminId');
    let database = localStorage.getItem('adminemail');
    let oldOrderId = JSON.parse(localStorage.getItem('order'))['localId'];
    let oldOrder = JSON.parse(localStorage.getItem('order'));
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    let tab = [];
    let obj2 = {
      products: items['products'],
      cartdetails: items['cartdetails'],
      totalPrice: items['totalPrice'],
      totalQty: items['totalQty'],
      montantRecu: items['montantRecu'],
    };

    oldOrder['commandes'].push(obj2);
    let newOrder = oldOrder;
    newOrder['cart'] = items;
    newOrder['commande'] = items;
    newOrder['adminId'] = id;
    let tab2 = [];
    tab2 = JSON.parse(localStorage.getItem(`allCommande`));

    if (tab2 && tab2.length) {
      let index2 = tab2.findIndex((elt) => {
        return elt.localId === oldOrderId;
      });
      if (index2 >= 0) {
        tab2.splice(index2, 1, newOrder);
        localStorage.setItem(`allCommande`, JSON.stringify(tab2));
      }
    }

    //  let uri = this.url + "invoice/add/newinvoice/to/old" + "?db=" + id;
    let userName = JSON.parse(localStorage.getItem('user'))['name'];
    let adminId = localStorage.getItem('adminId');

    let uri =
      //"127.0.0.1:3000/" +
      'http://127.0.0.1:3000/' +
      'invoice/commande/items/' +
      userName +
      '/' +
      adminId +
      '/' +
      '?db=' +
      adminId;
    let ur = this.uri2 + 'invoice/add/newinvoice/to/old' + '?db=' + id;
    newOrder['url'] = ur;
    newOrder['add'] = 1;

    let obj = JSON.stringify(newOrder);

    this.httpN.setDataSerializer('utf8');
    this.httpN
      .post(uri, obj, {})
      .then((response) => {
        let tab = [];
        tab = JSON.parse(localStorage.getItem(`userCommande`));
        let index = tab.findIndex((elt) => {
          return elt.localId == oldOrderId;
        });
        if (index >= 0) {
          tab.splice(index, 1, newOrder);
          localStorage.setItem(`userCommande`, JSON.stringify(tab));
        }
        localStorage.removeItem('order');
        localStorage.removeItem('addFlag');
        this.allCart['products'] = [];
        this.modalController.dismiss('update');
      })
      .catch((error) => {
        alert('impossible de joindre la caisse');
        alert(JSON.stringify(error));
        localStorage.removeItem('order');
      });
  }

  ristouneChecked(p) {
    p.item['noRistourne'];

    if (p.item['noRistourne'] == true) {
      p.item['noRistourne'] = false;
    } else {
      p.item['noRistourne'] = true;
    }
    // p.item["noRistourne"] = !p.item["noRistourne"];
    p;

    let index = this.allCart['products'].findIndex((elt) => {
      return elt.item._id == p.item._id;
    });
    index;

    if (index >= 0) {
      this.allCart['products'].splice(index, 1, p);
    }
    /* this.restApiService.saveCart({
      cart: this.allCart["cart"],
      products: this.allCart["products"],
    }); */
  }

  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 8000,
        message: 'please wait ...',
      })
      .then((a) => {
        a.present().then(() => {
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

  async giveToRetailer(tableNumber) {
    let resource = [];
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    // this.restApiService.getCart().subscribe((data) => {
    let data = this.allCart;

    let lacommande = {
      products: data['products'],
      cartdetails: data['cart'],
    };
    if (this.customer) {
      lacommande['customer'] = this.saveRandom.getRetailer();
    }
    if (this.customer['isRetailer']) {
      lacommande['isRetailer'] = this.customer['isRetailer'];
    }
    if (this.inputvalue) {
      lacommande['reste'] = this.reste;
      lacommande['montantRecu'] = this.totalAmount + this.reste;
    } else {
      lacommande['montantRecu'] = 0;
      lacommande['reste'] = -this.totalAmount;
    }
    if (this.resourceTab) {
      resource = this.resourceTab;
    }

    if (tabRoles.includes(4)) {
      let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
      if (
        this.platform.is('desktop') ||
        this.platform.is('electron') ||
        this.platform.is('pwa')
      ) {
        let idL =
          Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
        idL = idL + Date.now().toString();
        lacommande['localId'] = idL;
        lacommande['storeId'] = storeId;
        this.restApiService
          .commande(lacommande, tableNumber, resource)
          .subscribe((data) => {
            this.notifi.presentToast('save invoices to the server', 'success');
            this.customer = null;
            this.allCart['products'] = [];
            // this.router
            this.modalController.dismiss('update');
          });
        // return;
      }
      if (this.platform.is('android')) {
        this.posSendCommande(lacommande, tableNumber, resource);
      }
    } else if (tabRoles.includes(2)) {
      let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
      let idL =
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5) + JSON.parse(localStorage.getItem('user'))['_id'];
      idL = idL + Date.now().toString();
      lacommande['localId'] = idL;
      lacommande['storeId'] = storeId;
      this.restApiService
        .commande(lacommande, tableNumber, resource)
        .subscribe((data) => {
          this.notifi.presentToast('save invoices to the server', 'success');
          this.customer = null;
          this.allCart['products'] = [];
          this.modalController.dismiss('update');
        });
    }
  }

  async CreatePopover() {
    const modal = await this.modalController.create({
      component: AddConsignePage,
      cssClass: 'mymodal-class',
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((res) => {
      if (res['data']['consigne']) {
        this.consigneTab = res['data']['consigne'];
      }
    });

    return await modal.present();
  }
  manageConsigne(row) {
    console.log(row);
  }

  changeProdPrice(ev, row) {
    let setting = this.saveRandom.getSetting();
    if (!setting.change_price) {
      return;
    }

    let newPrice = parseInt(ev.detail.value);
    let acceptPrice = 0;
    let data = {};
    data['product'] = row;
    data['cart'] = this.allCart['cart'];

    if (row.item.acceptPrice) {
      acceptPrice = row.item.acceptPrice;
    } else if (row.item.BTL && row.item.CA) {
      acceptPrice = row.item.sellingPackPrice + row.item.sellingPrice;
    } else if (row.item.BTL && !row.item.CA) {
      acceptPrice = row.item.sellingPrice;
    } else if (!row.item.BTL && row.item.CA) {
      acceptPrice = row.item.sellingPackPrice;
    } else {
      acceptPrice = row.item.sellingPrice;
    }
    if (newPrice && newPrice >= acceptPrice) {
      console.log('add this ===>', acceptPrice);
      let cart = this.manageCartService.addNewPrice(
        data,
        newPrice,
        row.item['_id']
      );

      let id = row.item['_id'];
      cart.items[id]['item']['newPrice'] = newPrice;
      this.totalPrice = cart['totalPrice'];
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    } else {
      let cart = this.manageCartService.addNewPrice(
        data,
        row.item.sellingPrice,
        row.item['_id']
      );
      console.log('change price', acceptPrice);
      let id = row.item['_id'];
      cart.items[id]['item']['newPrice'] = row.item.sellingPrice;
      this.totalPrice = cart['totalPrice'];
      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
      this.notifi
        .presentToast('unable to change price !'.toUpperCase(), 'danger')
        .then(() => {});
    }
  }

  checkIfSaleToPAck() {
    if (JSON.parse(localStorage.getItem('setting'))) {
      let setting = JSON.parse(localStorage.getItem('setting'));

      if (Array.isArray(setting)) {
        if (setting[0]['SaleInPack']) {
          this.checkPack = true;
        } else {
          this.checkPack = false;
        }
      } else {
        if (setting['SaleInPack']) {
          this.checkPack = true;
        } else {
          this.checkPack = false;
        }
      }
    }
  }

  checkAndBuyinvoice(order) {
    console.log('check here====>', order);
    let sum = 0;
    let montantR = 0;
    return new Promise((resolve, reject) => {
      order['commandes'].forEach((com) => {
        if (com['cartdetails']) {
          sum = sum + com['cartdetails']['totalPrice'];
        } else {
          com['cartdetails'] = com['cart']['cartdetails'];
          sum = sum + com['cartdetails']['totalPrice'];
        }
      });
      order['trancheList'].forEach((tranch) => {
        if (tranch['montant']) {
          montantR = montantR + parseInt(tranch['montant']);
        }
      });
      let result = montantR - sum;
      if (result >= 0) {
        order['reimbursed'] = 2;
        order.cash = true;
        order.sale = true;
        order['partially'] = false;
        // order.rembourse = this.rembourse;
        console.log(result);

        resolve(order);
      } else {
        reject('false');
      }
    });
  }
  async confirmPaiement(order) {
    return new Promise((resolve, reject) => {
      let a: any = {};
      this.translate.get('MENU.confirmpaie').subscribe((t) => {
        a['confirm'] = t;
      });
      this.translate.get('MENU.ok').subscribe((t) => {
        a['OK'] = t;
      });
      this.translate.get('MENU.no').subscribe((t) => {
        a['NO'] = t;
      });

      this.notifi
        .presentAlertConfirm(a['confirm'] + '?', a['OK'], a['NO'])
        .then((res) => {
          order['confirmPaie'] = true;
          resolve(order);
        })
        .catch((err) => {
          order['confirmPaie'] = false;
          resolve(order);
        });
    });
  }
  async confirmLivraison(order) {
    return new Promise((resolve, reject) => {
      let a: any = {};
      this.translate.get('MENU.delivery').subscribe((t) => {
        this.notifi
          .presentAlertConfirm(t)
          .then((res) => {
            order['delivery'] = true;
            resolve(order);
          })
          .catch((err) => {
            order['delivery'] = false;
            resolve(order);
          });
      });
    });
  }

  postChildInvoice(lacommande) {
    console.log('hello child commande');

    this.saveRandom.setData(lacommande);
    (lacommande['confirm'] = true),
      (lacommande['userName'] = JSON.parse(localStorage.getItem('user'))[
        'name'
      ]),
      (lacommande['billId'] = this.saveRandom.getVoucher().billId);
    this.childBill.buyChildOrder(lacommande).subscribe(async (data) => {
      this.notifi.dismissLoading();
      this.saveRandom.setVoucher(null);
      this.allCart['products'] = [];
      this.customer = null;
      this.modalController.dismiss('update');
      this.saveRandom.setVoucher(null);
    });
  }

  extractQuantity(product: any[]) {
    let arr = product;
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
  async getTableNumber(a) {
    return new Promise(async (resolve, reject) => {
      let numeroTable = 1;

      const alert = await this.alertController.create({
        header: '',
        id: 'autofocu',
        message: 'TABLE NR',
        inputs: [
          {
            name: 'tableNumber',
            type: 'number',
          },
        ],
        buttons: [
          {
            text: 'OK',
            handler: (data) => {
              // (data);
              this.events.refresh();
              let tableNumber = 0;
              if (parseInt(data['tableNumber'])) {
                tableNumber = parseInt(data['tableNumber']);
                numeroTable = parseInt(data['tableNumber']);
                resolve(numeroTable);
                // (tableNumber);
              } else {
                this.notifi.presentToast(
                  'veuillez entrer le numéro de table',
                  'danger'
                );
              }
            },
          },
        ],
        //  (this.allCart);
      });
      await alert.present().then((data) => {
        // data;

        document.getElementById('autofocu').focus();
      });
    });
  }

  async invoicePrebuild(numeroTable, a) {
    if (JSON.parse(localStorage.getItem('order'))) {
      let tabRoles = JSON.parse(localStorage.getItem('roles'));
      if (tabRoles.includes(5)) {
        const alert = await this.alertController.create({
          header: '',
          message: a.confirmInvoice,
          backdropDismiss: false,
          buttons: [
            {
              text: a.no,
              handler: (data) => {},
            },
            {
              text: a.ok,
              handler: (data) => {
                this.buyItems(numeroTable);
              },
            },
          ],
          //  (this.allCart);
        });
        await alert.present().then((data) => {});
        return;
      }
      if (tabRoles.includes(4) || this.saveRandom.checkIfUsePack()) {
        this.buyItems(numeroTable);
        /*const alert = await this.alertController.create({
          header: '',
          message: a.confirmInvoice,
          backdropDismiss: false,
          buttons: [
            {
              text: a.no,
              handler: (data) => {},
            },
            {
              text: a.ok,
              handler: (data) => {
                this.buyItems(numeroTable);
              },
            },
          ],
          //  (this.allCart);
        });
        await alert.present().then((data) => {});*/
        //  return;
      }
    } else if (!this.manageCartService || this.saveRandom.checkIfUsePack()) {
      this.buyItems(numeroTable);
      /* const alert = await this.alertController.create({
        header: '',
        message: a.confirmInvoice,
        buttons: [
          {
            text: a.no,
            handler: (data) => {},
          },
          {
            text: a.ok,
            handler: (data) => {
              this.buyItems(numeroTable);
            },
          },
        ],
        //  (this.allCart);
      });
      await alert.present().then((data) => {}); */
    }
  }
  async confirmAndPrint(data) {
    this.saveRandom.setData(data);
    const modal = await this.modalController.create({
      component: ConfirmPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(async (data) => {
      console.log(data);
      this.modalController.dismiss('update');
    });
    return await modal.present().then((created) => {
      //
    });
  }
  selectZone(ev) {
    console.log(ev.detail.value);
    let zone = this.zoneList.find((z) => z.name == ev.detail.value);
    console.log(zone);
    this.saveRandom.setZone(zone);
    this.saveRandom.calculDhl(this.setting, this.totalAmount);
  }
}
