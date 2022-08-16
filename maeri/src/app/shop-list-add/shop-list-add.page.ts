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
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-shop-list-add',
  templateUrl: './shop-list-add.page.html',
  styleUrls: ['./shop-list-add.page.scss'],
})
export class ShopListAddPage implements OnInit {
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
  page = '';
  constructor(
    navParams: NavParams,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private notifi: NotificationService
  ) {
    this.database = localStorage.getItem('adminemail');
    this.data = navParams.get('tabproducts');
    this.products = this.data['products'];
    this.page = this.data['page'];
    this.getCategories();
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    console.log(this.userStore);
    this.storeId = this.userStore[0]['id'];
  }

  ionViewDidEnter() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    console.log(this.userStore);
  }

  getCategories() {
    this.categorieSerice.getCategories().subscribe((data) => {
      console.log(data);
      this.getSupCategories();
      //  this.getResources();
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });
      console.log(this.categorys);
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

    this.categorystab = this.categorys.filter((elt) => {
      return elt._id == this.productId;
    });
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
    this.modalController.dismiss(this.products);
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

  async postProduct(form) {
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }

    this.presentLoading();

    let data = {
      storeId: this.storeId,
      categoryId: this.categorystab[0]['_id'],
      superCategory: 'shop',
      name: form.value.name,
      sellingPrice: form.value.sellingPrice,
      purchasingPrice: form.value.purchasingPrice,
      description: form.value.description,
      source: 'user',
      categoryName: this.categorystab[0]['name'],
      quantityToAlert: form.value.quantityToAlert,
    };

    this.restApi.addShopList(data).subscribe((data) => {
      this.dismissLoading();
      this.presentToast();
      this.formulaire.reset();

      if (this.products) {
        this.products.unshift(data['data']);
      }
    });
  }

  async assignStore(ev) {
    console.log(ev.target.value);
    this.storeId = ev.target.value;
  }
}
