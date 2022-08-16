import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CatService } from 'src/app/services/cat.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import {
  ModalController,
  NavParams,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { environment, uri } from '../../environments/environment';
import { MadebyService } from 'src/app/services/madeby.service';
import { ResourcesService } from '../services/resources.service';
import { PickResourcePage } from '../pick-resource/pick-resource.page';
import { UrlService } from '../services/url.service';
import { CreatepackService } from '../services/createpack.service';
import { NgForm } from '@angular/forms';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-user-add-own-product',
  templateUrl: './user-add-own-product.page.html',
  styleUrls: ['./user-add-own-product.page.scss'],
})
export class UserAddOwnProductPage implements OnInit {
  @Input() page: string;
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  file: File;
  url: any;
  isLoading: any;
  //flag_product: any;
  description: string;
  categorys: Array<any> = [];
  categorystab: Array<any>;
  mades: Array<any>;
  madeselect: any;
  productId: any;
  products: any;
  flag: any;
  data: any;
  database: any;
  unitName: any;
  categories: any;
  tabRoles = [];
  admin: boolean = false;
  resources: Array<any>;
  resourceList: any;
  userStore = [];
  storeID: any;
  supcategories: Array<any>;
  categorystabSup: Array<any>;
  superCategorie = '';
  supcatId: any;
  categorie = '';
  constructor(
    private madebyService: MadebyService,
    public restApi: RestApiService,
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private catService: CatService,
    private resourceService: ResourcesService,
    private urlService: UrlService,
    private createPack: CreatepackService,
    private notifi: NotificationService
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1)) {
      this.getCategories();
      this.getMade();
      this.admin = true;
      let user = JSON.parse(localStorage.getItem('user'));
      this.userStore = user[0]['storeId'];

      this.storeID = this.userStore[0]['id'];
      console.log(this.storeID);
    }
  }

  ngOnInit() {}
  takeUrl() {
    if (environment.production) {
      this.urlService.getUrl().subscribe((data) => {
        this.url = data;
        // console.log("url", this.url);
      });
    } else {
      this.url = uri;
    }
  }
  getCategories() {
    this.catService.getCategories().subscribe((data) => {
      console.log(data);
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });
      this.getSupCategories();
      this.getMaeriCategories();
    });
  }
  getMaeriCategories() {
    this.catService.getMarieCategories().subscribe((data) => {
      console.log(data);
      this.categorys = [...this.categorys, ...data['category']];
    });
  }
  getSupCategories() {
    /* this.catService.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.supcategories = data["category"];
    }); */

    let user = JSON.parse(localStorage.getItem('user'));
    this.supcategories = user[0]['storeType'];
  }

  getMade() {
    this.madebyService.getMarieMadeby().subscribe((data) => {
      console.log(data);
      this.mades = data['madeby'];
    });
  }

  test(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    this.productId = ev.target['value'];

    this.categorystab = this.categorys.filter(
      (item) => item['_id'] === this.productId
    )[0];

    console.log(this.categorystab);
  }

  test2(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    this.superCategorie = ev.target['value'];

    // this.categorystabSup = this.supcatId;
    /* this.supcategories.filter(
      (item) => item["_id"] === this.supcatId
    )[0]; */

    console.log(this.categorystabSup);
  }

  made(ev: Event) {
    // console.log(ev.target["value"]);

    this.madeselect = this.mades.filter(
      (item) => item['_id'] === ev.target['value']
    )[0]['name'];
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

  async register(form) {
    console.log(form.value);
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }
    this.presentLoading();
    var formData = new FormData();
    //form.value["productId"] = this.product["_id"];
    formData.append('categoryId', this.categorystab['_id']);
    formData.append('categoryName', this.categorystab['name']);
    formData.append('name', form.value.name);
    formData.append('capacity', this.unitName);

    formData.append('sellingPrice', form.value.sellingPrice);
    formData.append('description', form.value.description);
    //  await formData.append("packSize", form.value.packSize);
    // await formData.append("packPrice", form.value.packPrice);
    formData.append('ristourne', form.value.ristourne);
    formData.append('superCategory', 'bar');

    if (form.value.packPrice) {
      formData.append('packPrice', form.value.packPrice);
    } else {
      formData.append('packPrice', '0');
    }
    if (form.value.sellingPackPrice) {
      formData.append('sellingPackPrice', form.value.sellingPackPrice);
    } else {
      formData.append('sellingPackPrice', '0');
    }
    if (form.value.packSize) {
      formData.append('packSize', form.value.packSize);
    } else {
      formData.append('packSize', '1');
    }

    formData.append('storeId', this.storeID);

    if (this.resourceList) {
      formData.append('resourceList', JSON.stringify(this.resourceList));
    }

    if (form.value.sizeUnit) {
      formData.append('sizeUnit', form.value.sizeUnit);
    }
    if (this.unitName) {
      formData.append('unitName', this.unitName);
    }

    if (form.value.purchasingPrice) {
      await formData.append('purchasingPrice', form.value.purchasingPrice);
    } else {
      await formData.append('purchasingPrice', '0');
    }

    formData.append('image', this.file);

    let company = localStorage.getItem('company');
    await formData.append('produceBy', company);

    this.restApi.addProduct(formData, this.storeID).subscribe((data) => {
      console.log(data);
      this.dismissLoading();
      this.presentToast();
      this.modalController.dismiss();
      /* let productId = data['data']['_id'];
      delete data['data']['_id'];
      delete data['data']['productitems'];
      delete data['data']['filename'];
      delete data['data']['originalName'];
      delete data['data']['lemballus'];
      delete data['data']['originalName'];

      if (data['data']['sizeUnit']) {
        data['data']['sizeUnitProduct'] = data['data']['sizeUnit'];
      }
      if (data['data']['unitName']) {
        data['data']['unitNameProduct'] = data['data']['unitName'];
      }
      console.log("je 'envoi", data['data']); */
      /* this.restApi.addProductItem(data['data']).subscribe((elt) => {
        console.log(elt);
       

        elt['data']['packSize'] = form.value.packSize;
        elt['data']['packPrice'] = form.value.packPrice;

        this.createPack.registerPack(
          elt['data'],
          productId,
          elt['data']['_id']
        );
      });*/
    });
  }

  takeMaeriProducts() {
    this.restApi.getMaeriProduct().subscribe((data) => {
      console.log(data);
    });
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
  unitMeasure(ev) {
    //console.log(ev);
    // console.log(ev.target["value"]);
    this.unitName = ev.target['value'];
  }
  closeModal() {
    this.modalController.dismiss();
  }

  getResources() {
    this.resourceService.getResources().subscribe((data) => {
      console.log(data);
      this.resources = data['resources'];
    });
  }

  async pickResource() {
    console.log('ok');
    const modal = await this.modalController.create({
      component: PickResourcePage,
      componentProps: {
        tabs: this.resourceList,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data']) {
        this.resourceList = [...data['data']];
        console.log(this.resourceList);

        // this.resourceList = data["data"];
      }
    });
    return await modal.present();
  }
  async assignStore(ev) {
    let id = ev.target['value'];
    console.log(id);
    this.storeID = id;
    // console.log(this.userStore);
  }
}
