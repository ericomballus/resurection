import { Component, OnInit, Input } from '@angular/core';
import {
  NavParams,
  ModalController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { Setting } from '../models/setting.models';
import { PickResourcePage } from '../pick-resource/pick-resource.page';
import { CatService } from '../services/cat.service';
import { GetStoreNameService } from '../services/get-store-name.service';
import { ResourcesService } from '../services/resources.service';
import { RestApiService } from '../services/rest-api.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.page.html',
  styleUrls: ['./product-update.page.scss'],
})
export class ProductUpdatePage implements OnInit {
  @Input() product: any;
  isLoading: any;
  file: File;
  url: any;
  //@Input() lastName: string;
  // @Input() middleInitial: string;
  prod: any;
  all_products;
  unitName: any;
  superCategory: any;
  supcategories: Array<any>;
  supcatId: any;
  storeList: any;
  storeName = '';
  userStore = [];
  resourceList = [];
  resources: any;
  categorys: Array<any>;
  page: string;
  saleToRetailer = false;
  setting: Setting;
  constructor(
    navParams: NavParams,
    private modalController: ModalController,
    public restApiService: RestApiService,
    public toastController: ToastController,
    public loadingController: LoadingController,
    // private categorieSerice: CatService,
    public getStoreNameService: GetStoreNameService,
    private resourceService: ResourcesService,
    private catService: CatService,
    private saveRandom: SaverandomService
  ) {
    this.prod = navParams.get('product');
    console.log(this.prod);
    if (this.prod['retailerPrice']) {
    } else {
      this.prod['retailerPrice'] = 0;
    }

    if (this.prod['sellingPackPrice']) {
    } else {
      this.prod['sellingPackPrice'] = 0;
    }

    this.page = navParams.get('page');
    if (this.prod['resourceList'] && this.prod['resourceList'].length) {
      this.resourceList = this.prod['resourceList'];
    }
    this.getSupCategories();
    this.getUserStore();
    this.getResources();
    this.getCategories();
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    if (JSON.parse(localStorage.getItem('saleToRetailer'))) {
      this.saleToRetailer = true;
    }
  }

  ngOnInit() {
    this.setting = this.saveRandom.getSetting();
  }

  closeModal() {
    this.modalController.dismiss('no_update');
  }

  getCategories() {
    this.catService.getCategories().subscribe((data) => {
      console.log(data);
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });
      // this.getSupCategories();
    });
  }

  async getUserStore() {
    this.storeList = await this.getStoreNameService.getCustumerStoreList();
    let store = this.storeList.filter((store) => {
      return store.id == this.prod.storeId;
    });

    this.storeName = store[0]['name'];
  }

  updateProduct(form) {
    form.value._id = this.prod._id;
    this.prod['resourceList'] = this.resourceList;
    if (this.file) {
      console.log(this.prod);
      this.updateWithFile(this.prod);
      return;
    }
    this.prod['resourceList'] = this.resourceList;

    this.restApiService.updateProduct(form.value._id, this.prod).subscribe(
      (data) => {
        console.log(data);
        delete form.value['_id'];
        form.value['productId'] = this.prod._id;
        this.prod = data['result'];

        this.dismissLoading()
          .then((res) => {})
          .catch((err) => console.log(err));
        this.presentToast();
        this.modalController.dismiss(this.prod);
      },
      (err) => {
        console.log(err);
      }
    );
  }
  unitMeasure(ev: Event) {
    console.log(ev.target['value']);
    this.unitName = ev.target['value'];
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: `product have been update.`,
      duration: 2000,
      position: 'top',
      animated: true,
      color: 'success',
      // cssClass: "my-custom-class",
    });
    toast.present();
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

  getSupCategories() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.supcategories = user[0]['storeType'];
    /*this.categorieSerice.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.supcategories = data["category"];
    }); */
  }

  test2(ev: Event) {
    // console.log(ev);

    this.supcatId = ev.target['value'];
    this.prod['categoryId'] = ev.target['value'];

    let cat = this.categorys.filter((item) => item['_id'] === this.supcatId)[0];
    console.log(cat);
    this.prod['categoryName'] = cat.name;
    // this.productPick[i]["superCategory"] = this.supcatId;
    /// console.log(this.categorystabSup);
    // console.log(this.productPick[i]);*/
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
        this.resourceList = [...this.resourceList, ...data['data']];
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

  async updateWithFile(prod) {
    this.presentLoading();
    var formData = new FormData();
    for (const key in prod) {
      formData.append(key, prod[key]);
    }

    formData.append('image', this.file);
    this.restApiService
      .updateProductWithImage(formData)
      .subscribe((response) => {
        console.log(response);
        this.prod['filename'] = response['filename'];
        this.prod['originalName'] = response['originalName'];
        this.prod['url'] = response['url'];
        this.restApiService.updateProduct(this.prod._id, this.prod).subscribe(
          (data) => {
            console.log(data);

            this.prod = data['result'];

            this.dismissLoading()
              .then((res) => {})
              .catch((err) => console.log(err));
            this.presentToast();
            this.modalController.dismiss(this.prod);
          },
          (err) => {
            console.log(err);
          }
        );
      });
  }
}
