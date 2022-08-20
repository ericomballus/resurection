import { Injectable } from '@angular/core';
import { Admin } from '../models/admin.model';
import { AgenceCommande } from '../models/agenceCommande';
import { Contrat } from '../models/contrat.model';
import { Patient } from '../models/patient.model';
import { Product } from '../models/product.model';
import { Setting } from '../models/setting.models';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class SaverandomService {
  retailer: any;
  isRetailer = false;
  isSuperManager = false;
  consigne: any;
  setting: any;
  purchase: any;
  invoices: any[];
  customers: any[];
  data: any;
  productToUpdate: any;
  voucher: any;
  productGammeList: Product[] = [];
  dbName: any;
  collectionList: any;
  storeId: null;
  employesList: any[] = [];
  userAdmin: Admin;
  patient: Patient;
  parameters: any[];
  avaibleStock: any[];
  contrat: Contrat;
  AgenceCommande: AgenceCommande[];
  purchaseData: any;
  clientType: string = null;
  grammage = 0;
  zone: any = null;
  tAmount = 0;
  dhlObj: any = null;
  expensiveAndCash = null;
  customer: any = null;
  facture: Contrat;
  constructor() {}

  setRetailer(data) {
    console.log(data);

    this.retailer = data;
  }

  getRetailer() {
    if (this.retailer === null) {
      return null;
    } else {
      return this.retailer;
    }
  }
  setSuperManager() {
    this.isSuperManager = true;
  }

  getSuperManager() {
    return this.isSuperManager;
  }
  confirmIfIsRetailer() {
    this.isRetailer = true;
  }
  isNotRetailer() {
    this.isRetailer = false;
  }

  checkIfIsRetailer() {
    return this.isRetailer;
  }

  checkIfUsePack() {
    return new Promise((resolve, reject) => {
      if (this.setting) {
        let setting = this.setting;
        if (Array.isArray(setting)) {
          if (setting[0]['SaleInPack']) {
            localStorage.setItem('saleAsPack', 'true');
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          if (setting['SaleInPack']) {
            localStorage.setItem('saleAsPack', 'true');
            resolve(true);
          } else {
            resolve(false);
          }
        }
      } else {
        if (JSON.parse(localStorage.getItem('setting'))) {
          // ;
          let setting = JSON.parse(localStorage.getItem('setting'));
          if (Array.isArray(setting)) {
            if (setting[0]['SaleInPack']) {
              localStorage.setItem('saleAsPack', 'true');
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            if (setting['SaleInPack']) {
              localStorage.setItem('saleAsPack', 'true');
              resolve(true);
            } else {
              resolve(false);
            }
          }
        } else {
          resolve(false);
        }
      }
    });
  }
  setConsigne(data) {
    console.log(data);

    this.retailer = data;
  }
  getConsigne() {
    if (this.consigne === null) {
      return 0;
    } else {
      return this.consigne;
    }
  }

  setSetting(data) {
    console.log(data);

    this.setting = data;
  }
  getSetting(): Setting {
    if (this.setting === null) {
      return null;
    } else {
      return this.setting;
    }
  }

  getStoreId() {
    if (this.storeId) {
      return this.storeId;
    } else {
      let user = JSON.parse(localStorage.getItem('credentialUser'))['user'][0];

      return user.storeId;
    }
  }
  setStoreId(storeId) {
    this.storeId = storeId;
  }

  getAdminAccount() {
    let admin: Admin = JSON.parse(localStorage.getItem('adminUser'));
    if (!admin) {
      admin = JSON.parse(localStorage.getItem('user'))[0];
    }
    if (admin) {
      return admin;
    } else {
      return null;
    }
  }

  getUserCredentail() {
    let user: User = JSON.parse(localStorage.getItem('user'));

    if (user) {
      return user;
    } else {
      return user;
    }
  }

  setResumePurchase(data) {
    console.log(data);

    this.purchase = data;
  }
  getResumePurchase() {
    if (this.setting === null) {
      return 0;
    } else {
      return this.purchase;
    }
  }

  setCustomerInvoices(data: any[]) {
    console.log(data);

    this.invoices = data;
  }
  getCustomerInvoices() {
    if (this.invoices === null) {
      return [];
    } else {
      return this.invoices;
    }
  }

  setCustomerList(data: any[]) {
    this.customers = data;
  }
  getCustomerList() {
    if (this.customers === null) {
      return [];
    } else {
      return this.customers;
    }
  }

  setData(data) {
    this.data = data;
  }
  getData() {
    if (this.data === null) {
      return 0;
    } else {
      return this.data;
    }
  }

  setProductToUpdate(data) {
    this.productToUpdate = data;
    console.log('reset to update ===>', this.productToUpdate);
  }
  getProductToUpdate() {
    if (this.productToUpdate === null) {
      return 0;
    } else {
      return this.productToUpdate;
    }
  }

  setVoucher(data) {
    this.voucher = data;
  }
  getVoucher() {
    if (this.voucher === null) {
      return 0;
    } else {
      return this.voucher;
    }
  }

  setProducListGamme(products: Product[]) {
    this.productGammeList = products;
  }
  getProducListGamme() {
    return this.productGammeList;
  }

  setEmployeList(data: any[]) {
    this.employesList = data;
  }
  getEmployeList() {
    return this.employesList;
  }

  getStoreList(): any[] {
    if (JSON.parse(localStorage.getItem('credentialAccount'))) {
      let adminAccount = JSON.parse(localStorage.getItem('credentialAccount'))[
        'users'
      ];
      if (adminAccount) {
        return adminAccount[0]['storeId'];
      } else {
        return null;
      }
    } else if (
      JSON.parse(localStorage.getItem('user')) &&
      JSON.parse(localStorage.getItem('user'))[0]
    ) {
      let adminAccount = JSON.parse(localStorage.getItem('user'))[0];
      return adminAccount['storeId'];
    } else {
      return null;
    }
  }

  getStoreTypeList(): string[] {
    if (JSON.parse(localStorage.getItem('credentialAccount'))) {
      let adminAccount = JSON.parse(localStorage.getItem('credentialAccount'))[
        'users'
      ];
      if (adminAccount) {
        return adminAccount[0]['storeType'];
      } else {
        return null;
      }
    } else if (
      JSON.parse(localStorage.getItem('user')) &&
      JSON.parse(localStorage.getItem('user'))[0]
    ) {
      let adminAccount = JSON.parse(localStorage.getItem('user'))[0];
      return adminAccount['storeType'];
    } else {
      return null;
    }
  }

  checkAndBuyinvoice(order) {
    let sum = 0;
    let montantR = 0;
    return new Promise((resolve, reject) => {
      order['commandes'].forEach((com) => {
        if (com['cartdetails']) {
          sum = sum + parseInt(com['cartdetails']['totalPrice']);
        } else {
          com['cartdetails'] = com['cart']['cartdetails'];
          sum = sum + parseInt(com['cartdetails']['totalPrice']);
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
        resolve(order);
      } else {
        reject('ok');
      }
    });
  }

  getCashOpenId() {
    let id = JSON.parse(localStorage.getItem('openCashDateObj'));
    let openCashDateId = null;
    if (id) {
      openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
        '_id'
      ];
      if (openCashDateId) {
        return openCashDateId;
      } else {
        return null;
      }
    } else {
      return null;
    }
    // let openCashDateId = JSON.parse(localStorage.getItem('openCashDateObj'))[
    // '_id'
    // ];
  }

  setDbName(data) {
    this.dbName = data;
  }

  getDbName() {
    if (this.dbName == null || this.dbName == undefined) {
      return 0;
    } else {
      return this.dbName;
    }
  }
  setCollectionList(data) {
    this.collectionList = data;
  }

  getCollectionList() {
    if (this.collectionList == null || this.collectionList == undefined) {
      return 0;
    } else {
      return this.collectionList;
    }
  }

  setUserAdmin(data: Admin) {
    this.userAdmin = data;
  }

  getUserAdmin(): Admin {
    if (this.userAdmin == null || this.userAdmin == undefined) {
      return null;
    } else {
      return this.userAdmin;
    }
  }

  setPatient(data: Patient) {
    this.patient = data;
  }

  getPatient(): Patient {
    if (this.patient == null || this.patient == undefined) {
      return null;
    } else {
      return this.patient;
    }
  }

  setPatientParameter(data: any[]) {
    this.parameters = data;
  }

  getPatientParameter(): any[] {
    if (this.parameters == null || this.parameters == undefined) {
      return null;
    } else {
      return this.parameters;
    }
  }

  setAvaibleStock(data: any[]) {
    this.avaibleStock = data;
  }

  getAvaibleStock(): any[] {
    if (this.avaibleStock == null || this.avaibleStock == undefined) {
      return null;
    } else {
      return this.avaibleStock;
    }
  }

  setContrat(data: Contrat) {
    this.contrat = data;
  }

  getContrat(): Contrat {
    if (this.contrat == null || this.contrat == undefined) {
      return null;
    } else {
      return this.contrat;
    }
  }

  setAgenceCommande(data: AgenceCommande[]) {
    this.AgenceCommande = data;
  }

  getAgenceCommande(): AgenceCommande[] {
    if (this.AgenceCommande == null || this.AgenceCommande == undefined) {
      return null;
    } else {
      return this.AgenceCommande;
    }
  }

  setPurchase(data) {
    this.purchaseData = data;
  }

  getPurchase() {
    if (this.purchaseData == null || this.purchaseData == undefined) {
      return null;
    } else {
      return this.purchaseData;
    }
  }
  getTabRole(): any[] {
    let tabRoles = JSON.parse(localStorage.getItem('roles'));
    return tabRoles;
  }
  setClientType(data) {
    this.clientType = data;
  }
  getClientType() {
    if (this.clientType == null || this.clientType == undefined) {
      return null;
    } else {
      return this.clientType;
    }
  }

  setGrammage(data) {
    this.grammage = data;
    this.dhlObj = null;
  }
  getGrammage() {
    if (this.grammage == null || this.grammage == undefined) {
      return 0;
    } else {
      return this.grammage;
    }
  }

  setTotalAmount(data) {
    this.tAmount = data;
  }
  getTotalAmount() {
    if (this.tAmount == null || this.tAmount == undefined) {
      return 0;
    } else {
      return this.tAmount;
    }
  }

  setZone(data) {
    this.zone = data;
  }
  getZone() {
    if (this.zone == null || this.zone == undefined) {
      return 0;
    } else {
      return this.zone;
    }
  }
  calculDhl(setting: Setting, montant) {
    let nbrC = 0;
    nbrC = this.grammage / 5000;
    nbrC = Math.ceil(nbrC);
    console.log(nbrC);

    let zoneAmount = this.getZone().amount;
    let transport_un_carton = 1.03 * zoneAmount;
    console.log('====', transport_un_carton);
    let transport_total_carton = transport_un_carton * nbrC;
    console.log('====total ici', transport_total_carton);
    let DHL = 0;
    DHL =
      transport_total_carton +
      setting.taxe_covid * nbrC +
      setting.surcharge_carburant * nbrC;
    let Phyto = nbrC * setting.taxe_phyto;
    let taxe_retrait = 0; //retrait
    taxe_retrait = ((montant + DHL + Phyto) * 0.2) / 100;
    let net_a_payer = montant + DHL + Phyto + taxe_retrait;

    this.dhlObj = {
      transport: transport_total_carton,
      transport_colis: transport_total_carton,
      phyto: Phyto,
      taxeRetrait: taxe_retrait,
      montant: net_a_payer,
      DHL: DHL,
      poids_estimatif: this.grammage + nbrC * 300,
    };
  }

  setExpensiveAndCash(data) {
    this.expensiveAndCash = data;
  }
  getExpensiveAndCash() {
    if (this.expensiveAndCash == null || this.expensiveAndCash == undefined) {
      return 0;
    } else {
      return this.expensiveAndCash;
    }
  }

  setCustomer(data) {
    this.customer = data;
  }
  getCustmer() {
    if (this.customer == null || this.customer == undefined) {
      return 0;
    } else {
      return this.customer;
    }
  }
  getBills() {}
  setUserBill(data: Contrat) {
    this.facture = data;
  }
  getUserBill() {
    if (this.facture == null || this.facture == undefined) {
      return null;
    } else {
      return this.facture;
    }
  }
}
