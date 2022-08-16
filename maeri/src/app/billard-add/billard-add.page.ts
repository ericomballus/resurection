import { Component, OnInit, ViewChild } from '@angular/core';
import { CatService } from 'src/app/services/cat.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import {
  ModalController,
  NavParams,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { environment, uri } from '../../environments/environment';
import { Router } from '@angular/router';
import { PickResourcePage } from '../pick-resource/pick-resource.page';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notification.service';
import { TranslateConfigService } from '../translate-config.service';
import { Setting } from '../models/setting.models';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-billard-add',
  templateUrl: './billard-add.page.html',
  styleUrls: ['./billard-add.page.scss'],
})
export class BillardAddPage implements OnInit {
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  file: File;
  url: any;
  isLoading: any;
  //flag_product: any;
  description: string;
  categorys: Array<any>;
  supcategories: Array<any>;
  resources: Array<any>;
  categorystab: Array<any>;
  categorystabSup: Array<any>;
  productId: any;
  supcatId: any;
  products: any;
  flag: any;
  data: any;
  database: any;
  userStore = [];
  storeId: any;
  resourceList: any;
  totalCoast = 0;
  page = '';
  useBonus: Boolean = false;
  selectedLanguage: string;
  setting: Setting;
  constructor(
    navParams: NavParams,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private notifi: NotificationService,
    private translateConfigService: TranslateConfigService,
    private saveRandom: SaverandomService
  ) {
    this.database = localStorage.getItem('adminemail');
    this.data = navParams.get('tabproducts');
    this.products = this.data['products'];
    this.page = this.data['page'];
    this.getCategories();
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    let setting = JSON.parse(localStorage.getItem('setting'))[0];
    this.setting = this.saveRandom.getSetting();
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    if (setting && setting['use_bonus']) {
      this.useBonus = true;
    }
    this.userStore = user[0]['storeId'];
    this.storeId = this.userStore[0]['id'];
  }

  ionViewDidEnter() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
  }

  getCategories() {
    this.categorieSerice.getCategories().subscribe((data) => {
      this.getSupCategories();
      //  this.getResources();
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page || elt.page == this.page + '.page';
        }
      });
    });
  }

  getSupCategories() {
    /* this.categorieSerice.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.supcategories = data["category"];
    }); */
    let user = JSON.parse(localStorage.getItem('user'));
    this.supcategories = user[0]['storeType'];
  }
  readUrl(event: any) {
    // this.flag_product = "ok";
    this.file = event.target.files[0];
    //console.log(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  test(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    this.productId = ev.target['value'];

    this.categorystab = this.categorys.filter(
      (item) => item['_id'] === this.productId
    )[0];
  }

  test2(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    this.supcatId = ev.target['value'];

    this.categorystabSup = this.supcatId;
    /*this.supcategories.filter(
      (item) => item["_id"] === this.supcatId
    )[0]; */

    console.log(this.categorystabSup);
  }

  closeModal() {
    // this.modalController.dismiss(this.products);
    this.modalController.dismiss('no_update');
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: `product have been save.`,
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-class',
    });
    toast.present();
  }

  async postBillardTicket(form) {
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }

    this.presentLoading();

    var formData = new FormData();
    await formData.append('categoryId', this.categorystab['_id']);
    await formData.append('categoryName', this.categorystab['name']);
    await formData.append('superCategory', 'services');
    await formData.append('name', form.value.name);
    await formData.append('sellingPrice', form.value.sellingPrice);
    await formData.append('description', form.value.description);
    // await formData.append("purchasingPrice", "1")
    if (form.value.bonus) {
      await formData.append('bonus', form.value.bonus);
    } else {
      await formData.append('bonus', '0');
    }

    await formData.append('source', 'user');
    await formData.append('image', this.file);
    await formData.append('storeId', this.storeId);
    if (form.value.purchasingPrice) {
      formData.append('purchasingPrice', form.value.purchasingPrice);
    } else {
      formData.append('purchasingPrice', '0');
    }

    if (this.resourceList) {
      formData.append('resourceList', JSON.stringify(this.resourceList));
    } else {
      formData.append('resourceList', JSON.stringify([]));
    }
    console.log(form.value);
    this.restApi.addBillardGame(formData).subscribe(
      (data) => {
        this.formulaire.reset();
        this.resourceList = [];
        this.url = null;
        this.dismissLoading();
        this.presentToast();
        this.modalController.dismiss();
      },
      (err) => {
        console.log('error here ===>', err);
      }
    );
  }

  async assignStore(ev) {
    console.log(ev.target.value);
    this.storeId = ev.target.value;
  }

  async pickResource() {
    console.log('ok');
    const modal = await this.modalController.create({
      component: PickResourcePage,
      componentProps: {
        tabs: this.resourceList,
        page: 'billard',
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.totalCoast = 0;
      if (data['data']) {
        this.resourceList = data['data'];
        this.resourceList.forEach((resource) => {
          this.totalCoast = this.totalCoast + resource.coast;
        });
      } else if (this.resourceList && this.resourceList.length) {
        this.resourceList.forEach((resource) => {
          this.totalCoast = this.totalCoast + resource.coast;
        });
      }
    });
    return await modal.present();
  }
}
