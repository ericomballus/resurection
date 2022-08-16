import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AdminService } from '../services/admin.service';
import { ToastController } from '@ionic/angular';
import { FormGroup, FormBuilder } from '@angular/forms';
import { PrinterService } from '../services/printer.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from '../translate-config.service';
import { ModalController } from '@ionic/angular';
import { ZoneExpeditionPage } from '../modals/zone-expedition/zone-expedition.page';
import { SaverandomService } from '../services/saverandom.service';
import { Setting } from 'src/app/models/setting.models';
import { StoreListPage } from '../modals/store-list/store-list.page';

export interface typeDePaiement {
  name: string;
  telephone: number;
}
@Component({
  selector: 'app-company',
  templateUrl: './company.page.html',
  styleUrls: ['./company.page.scss'],
})
export class CompanyPage implements OnInit {
  companyName: string;
  phoneNumber: string;
  companyMail: string;
  ip: string;
  lat: any = 0;
  lng: any = 0;
  stock_min: any = 0;
  stock_min_aut: any;
  check: boolean = false;
  companyId: any;
  macServer: any;
  entete_facture: string;
  pied_facture: string;
  resource: Boolean = false;
  wifi: Boolean = false;
  manageStockWithService: Boolean = false;
  file: File;
  pied_page: File;
  url: any;
  logo: any;
  fileUploadForm: FormGroup;
  storeType: any;
  register_customer: Boolean = false;
  use_bonus: Boolean = false;
  selectedLanguage: string;
  phonePaiement: number = 0;
  phoneList: typeDePaiement[] = [];
  operatorName: string = '';
  taxe_covid = 0;
  taxe_phyto = 0;
  surcharge_carburant = 0;
  setting: Setting;
  constructor(
    private geolocation: Geolocation,
    public adminService: AdminService,
    public toastController: ToastController,
    private formBuilder: FormBuilder,
    private printerService: PrinterService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private modalController: ModalController,
    private random: SaverandomService
  ) {
    this.getSetting();
    this.storeType = JSON.parse(localStorage.getItem('user'))[0]['storeType'];

    console.log(this.storeType);
  }

  ngOnInit() {
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    this.fileUploadForm = this.formBuilder.group({
      uploadedImage: [''],
      pied_page: [''],
    });

    this.setting = this.random.getSetting();
  }
  languageChanged() {
    this.translateConfigService.setLanguage(this.selectedLanguage);
  }
  save() {
    let obj = {
      latitude: this.lat,
      longitude: this.lng,
      name: this.companyName,
      companyMail: this.companyMail,
      phoneNumber: this.phoneNumber,
      entete_facture: this.entete_facture,
      pied_facture: this.pied_facture,
      ip: this.ip,
      stock_min: parseInt(this.stock_min),
      stock_min_aut: parseInt(this.stock_min_aut),
      macServer: this.macServer,
      use_resource: this.resource,
      manageStockWithService: this.manageStockWithService,
      register_customer: this.register_customer,
      use_bonus: this.use_bonus,
      taxe_phyto: this.taxe_phyto,
      taxe_covid: this.taxe_covid,
      surcharge_carburant: this.surcharge_carburant,
    };
    this.adminService.postCompanySetting(obj).subscribe((data) => {
      console.log(data);
      this.presentToast();
    });
  }

  async update() {
    let aut = 0;
    let adminId = localStorage.getItem('adminId');
    let obj = {};
    if (this.phoneList.length) {
      obj['phoneList'] = this.phoneList;
    }

    if (this.taxe_covid) {
      obj['taxe_covid'] = this.taxe_covid;
    }
    if (this.taxe_phyto) {
      obj['taxe_phyto'] = this.taxe_phyto;
    }

    if (this.stock_min_aut) {
      aut = parseInt(this.stock_min_aut);
      obj = {
        latitude: this.lat,
        longitude: this.lng,
        name: this.companyName,
        companyMail: this.companyMail,
        phoneNumber: this.phoneNumber,
        ip: this.ip,
        _id: this.companyId,
        stock_min: parseInt(this.stock_min),
        stock_min_aut: parseInt(this.stock_min_aut),
        macServer: this.macServer,
        entete_facture: this.entete_facture,
        pied_facture: this.pied_facture,
        use_resource: this.resource,
        use_wifi: this.wifi,
        manageStockWithService: this.manageStockWithService,
        adminId: adminId,
        register_customer: this.register_customer,
        use_bonus: this.use_bonus,
        phoneList: this.phoneList,
        taxe_phyto: this.taxe_phyto,
        taxe_covid: this.taxe_covid,
        surcharge_carburant: this.surcharge_carburant,
      };
    } else {
      obj = {
        latitude: this.lat,
        longitude: this.lng,
        name: this.companyName,
        companyMail: this.companyMail,
        phoneNumber: this.phoneNumber,
        ip: this.ip,
        _id: this.companyId,
        stock_min: parseInt(this.stock_min),
        macServer: this.macServer,
        entete_facture: this.entete_facture,
        pied_facture: this.pied_facture,
        use_resource: this.resource,
        use_wifi: this.wifi,
        manageStockWithService: this.manageStockWithService,
        adminId: adminId,
        register_customer: this.register_customer,
        use_bonus: this.use_bonus,
        phoneList: this.phoneList,
        taxe_phyto: this.taxe_phyto,
        taxe_covid: this.taxe_covid,
        surcharge_carburant: this.surcharge_carburant,
        // stock_min_aut: parseInt(this.stock_min_aut)
      };
    }

    if (this.pied_page) {
      const formData = new FormData();
      formData.append(
        'uploadedImage',
        this.fileUploadForm.get('pied_page').value
      );
      formData.append('agentId', '008');
      let URL = `custumerlogo/${adminId}?db=${adminId}`;
      let res = await this.adminService.postLogoPromise(formData, URL);
      console.log('voici le pied de page ici ===>', res);
      obj['pied_page'] = res['url'];
    }
    if (this.file) {
      const formData = new FormData();
      formData.append(
        'uploadedImage',
        this.fileUploadForm.get('uploadedImage').value
      );
      formData.append('agentId', '007');
      let URL = `custumerlogo/${adminId}?db=${adminId}`;
      let res = await this.adminService.postLogoPromise(formData, URL);
      console.log('voici entete page ici===>', res);
      obj['logo'] = res['url'];
    }

    this.adminService.updateCompanySetting(obj).subscribe((data) => {
      if (data['company'].length) {
        this.check = true;
        let obj = data['company'][0];
        this.lat = obj['latitude'];
        this.lng = obj['longitude'];
        this.companyName = obj['name'];
        this.phoneNumber = obj['phoneNumber'];
        this.ip = obj['ip'];
        this.companyId = obj['_id'];
        this.stock_min = obj['stock_min'];
        this.stock_min_aut = obj['stock_min_aut'];
        this.macServer = obj['macServer'];
        this.entete_facture = obj['entete_facture'];
        this.pied_facture = obj['pied_facture'];
        this.resource = obj['use_resource'];
        this.wifi = obj['use_wifi'];
        this.companyMail = obj['companyMail'];
        this.manageStockWithService = obj['manageStockWithService'];
        this.logo = obj['logo'];
        this.register_customer = obj['register_customer'];
        this.use_bonus = obj['use_bonus'];
      }
      this.presentToast();
      this.printerService.download(obj['logo']);
    });
  }
  getLocation() {
    this.geolocation
      .getCurrentPosition({
        maximumAge: 1000,
        timeout: 5000,
        enableHighAccuracy: true,
      })
      .then(
        (resp) => {
          // resp.coords.latitude
          // resp.coords.longitude
          //alert("r succ"+resp.coords.latitude)
          // alert(JSON.stringify(resp.coords));

          this.lat = resp.coords.latitude;
          this.lng = resp.coords.longitude;
        },
        (er) => {
          //alert("error getting location")
          alert('Can not retrieve Location');
        }
      )
      .catch((error) => {
        //alert('Error getting location'+JSON.stringify(error));
        alert('Error getting location - ' + JSON.stringify(error));
      });
  }
  getSetting() {
    this.adminService.getCompanySetting().subscribe((data) => {
      console.log(data);

      if (data['company'].length) {
        this.check = true;
        let obj = data['company'][0];
        this.lat = obj['latitude'];
        this.lng = obj['longitude'];
        this.companyName = obj['name'];
        this.phoneNumber = obj['phoneNumber'];
        this.ip = obj['ip'];
        this.companyId = obj['_id'];
        this.stock_min = obj['stock_min'];
        this.stock_min_aut = obj['stock_min_aut'];
        this.macServer = obj['macServer'];
        this.resource = obj['use_resource'];
        this.companyMail = obj['companyMail'];
        this.manageStockWithService = obj['manageStockWithService'];
        if (obj['register_customer']) {
          this.register_customer = obj['register_customer'];
        }

        if (obj['use_bonus']) {
          this.use_bonus = obj['use_bonus'];
        }

        if (obj['logo']) {
          this.url = obj['logo'];
        }
        if (obj['phoneList'] && obj['phoneList'].length) {
          this.phoneList = obj['phoneList'];
        }
        if (obj.taxe_covid) {
          this.taxe_covid = obj.taxe_covid;
        }
        if (obj.taxe_phyto) {
          this.taxe_phyto = obj.taxe_phyto;
        }
        if (obj.surcharge_carburant) {
          this.surcharge_carburant = obj.surcharge_carburant;
        }
        //surcharge_carburant
      }
    });
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      position: 'top',
      duration: 2000,
    });
    toast.present();
  }

  enableResource() {
    this.resource = !this.resource;
    console.log(this.resource);
  }
  enableGestionStock() {
    this.manageStockWithService = !this.manageStockWithService;
  }
  enableWifi() {
    this.wifi = !this.wifi;
    console.log(this.wifi);
  }

  readUrl(event: any) {
    // this.flag_product = "ok";
    this.file = event.target.files[0];
    const file = event.target.files[0];
    this.fileUploadForm.get('uploadedImage').setValue(file);
    //console.log(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
  readUrlPiedPage(event: any) {
    this.pied_page = event.target.files[0];
    console.log(event.target.files[0]);
    this.fileUploadForm.get('pied_page').setValue(event.target.files[0]);

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
  autoriseEnregistrementClient() {}
  getPhoneList() {
    console.log(this.phonePaiement);
    let typ: typeDePaiement = {
      name: this.operatorName,
      telephone: this.phonePaiement,
    };
    this.phoneList.push(typ);
    this.phonePaiement = 0;
  }

  typeDePaiment(ev) {
    if (ev.detail.value == 'ORANGE MONEY' || ev.detail.value == 'MTN MONEY') {
      this.operatorName = ev.detail.value;
    }
  }
  removeToPhoneList(doc, i) {
    this.phoneList.splice(i, 1);
  }

  async goToZonePage() {
    //console.log(product);
    const modal = await this.modalController.create({
      component: ZoneExpeditionPage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }
  async displayStoreDetails() {
    const modal = await this.modalController.create({
      component: StoreListPage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }
}
