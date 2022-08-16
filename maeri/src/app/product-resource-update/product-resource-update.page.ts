import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController, AlertController } from '@ionic/angular';
import { ResourcesService } from 'src/app/services/resources.service';
import { TranslateConfigService } from '../translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { DisplayResourcePage } from '../display-resource/display-resource.page';
import { RestApiService } from '../services/rest-api.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { CatService } from '../services/cat.service';
import { PickProductPage } from '../pick-product/pick-product.page';
import { PickResourcePage } from '../pick-resource/pick-resource.page';
@Component({
  selector: 'app-product-resource-update',
  templateUrl: './product-resource-update.page.html',
  styleUrls: ['./product-resource-update.page.scss'],
})
export class ProductResourceUpdatePage implements OnInit {
  prod: any;
  resources: any;
  storeList: any;
  storeName = '';
  supcategories = [];
  categorys: Array<any>;
  categorystab: any;
  resourceList = [];
  productId: any;
  categoryName;
  page: null;
  updateResoure = false;
  file: File;
  url: any;
  constructor(
    navParams: NavParams,
    public modalController: ModalController,
    public alertController: AlertController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private resourceService: ResourcesService,
    private resApi: RestApiService,
    public getStoreNameService: GetStoreNameService,
    private categorieSerice: CatService
  ) {
    this.prod = navParams.get('product');
    if (navParams.get('page')) {
      this.page = navParams.get('page');
    }

    if (this.prod['resourceList'].length) {
      this.resourceList = this.prod['resourceList'];
    }
    if (this.prod['categoryName']) {
      this.categoryName = this.prod['categoryName'];
    }
    console.log(this.prod);
    this.getUserStore();
    // this.getSupCategories();
    this.getCategories();
    this.getResources();
  }

  ngOnInit() {
    this.languageChanged();
    //  this.getResources();
  }

  closeModal() {
    this.modalController.dismiss('erico');
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  addUnit(select, prod) {
    console.log(prod);
    console.log(select);

    /*  let oldObj = this.tabs.filter(elt => {
        return elt.resourceId == prod._id;
      })[0];

      console.log(this.tab);
      if (oldObj) {
        console.log(oldObj);
        //
      } else {
      } */
  }

  async updataResource(item) {
    console.log(item);

    const modal = await this.modalController.create({
      //component: ProductManufacturedItemAddPage,
      component: DisplayResourcePage,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        product: item,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      //prod.resourceList
      //this.products = data["data"];
      console.log(this.prod['resourceList']);
      let oldObj = this.prod['resourceList'].filter((elt) => {
        return elt.resourceId == data['data']['resourceId'];
      });
      console.log(oldObj);
    });
    return await modal.present();
  }

  async update() {
    if (this.resourceList.length || this.updateResoure) {
      this.prod['resourceList'] = this.resourceList;
    }
    if (this.categorystab) {
      this.prod['categoryName'] = this.categorystab['name'];
    }
    if (this.file) {
      try {
        let photo = await this.updateWithFile();
        this.prod.filename = photo['filename'];
        this.prod.originalname = photo['originalname'];
        this.resApi
          .updateProductResto(this.prod['_id'], this.prod)
          .subscribe((data) => {
            this.modalController.dismiss('update');
          });
      } catch (error) {
        console.log(error);
      }
    } else {
      this.resApi
        .updateProductResto(this.prod['_id'], this.prod)
        .subscribe((data) => {
          this.modalController.dismiss('update');
        });
    }
  }

  async getUserStore() {
    this.storeList = await this.getStoreNameService.getCustumerStoreList();
    let store = this.storeList.filter((store) => {
      return store.id == this.prod.storeId;
    });

    this.storeName = store[0]['name'];
  }

  changeStore(ev: Event) {
    console.log(ev.target['value']);
    let ids = ev.target['value'];
    this.prod['storeId'] = ids;
    console.log(this.storeList);

    let store = this.storeList.filter((str) => {
      return str['id'] == ids;
    });
    console.log(store);

    this.storeName = store[0]['name'];
  }
  getSupCategories() {
    this.categorieSerice.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.supcategories = data['category'];
    });
  }
  test2(ev: Event) {
    // console.log(ev);

    console.log(ev.target['value']);
    // this.supcatId = ev.target["value"];
    this.prod['superCategory'] = ev.target['value'];
  }

  getCategories() {
    this.categorieSerice.getCategories().subscribe((data) => {
      console.log(data);
      this.getSupCategories();

      this.categorys = data['category'];
      if (this.page) {
        this.categorys = data['category'].filter((elt) => {
          if (elt.page) {
            return elt.page == this.page;
          }
        });
      }
    });
  }

  getResources() {
    this.resourceService.getResources().subscribe((data) => {
      console.log(data);
      this.resources = data['resources'];
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
    this.categoryName = this.categorystab['name'];
  }
  async pickResource() {
    console.log('ok');
    const modal = await this.modalController.create({
      component: PickResourcePage,
      componentProps: {
        tabs: this.resourceList,
        page: this.page,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data'] && data['data'].length) {
        // this.resourceList = [...this.resourceList, ...data["data"]];
        this.resourceList = data['data'];
      }
    });
    return await modal.present();
  }
  deleteResource(res) {
    console.log(res);

    this.resourceList = this.resourceList.filter((resource) => {
      return resource.resourceId !== res.resourceId;
    });
    console.log(this.resourceList);
    this.updateResoure = true;
  }
  readUrl(event: any) {
    // this.flag_product = "ok";
    this.file = event.target.files[0];
    //console.log(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.prod.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async updateWithFile() {
    return new Promise((resolve, reject) => {
      var formData = new FormData();

      formData.append('image', this.file);
      this.resApi.updateProductWithImage(formData).subscribe(
        (response) => {
          console.log(response);
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
