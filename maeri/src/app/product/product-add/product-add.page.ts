import { Component, OnInit, ViewChild } from '@angular/core';
import { CatService } from 'src/app/services/cat.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import {
  ModalController,
  NavParams,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { PickProductPage } from 'src/app/pick-product/pick-product.page';
import { ResourcesService } from 'src/app/services/resources.service';
import { PickResourcePage } from 'src/app/pick-resource/pick-resource.page';
import { UrlService } from 'src/app/services/url.service';
import { Observable, from, of, zip, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreatepackService } from 'src/app/services/createpack.service';
import { NotificationService } from 'src/app/services/notification.service';
import io from 'socket.io-client';
@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.page.html',
  styleUrls: ['./product-add.page.scss'],
})
export class ProductAddPage implements OnInit {
  file: File;
  url: any;
  isLoading: any;
  //flag_product: any;
  description: string;
  categorys: Array<any>;
  resources: Array<any>;
  categorystab: Array<any>;
  productId: any;
  products: Array<any>;
  flag: any;
  data: any;
  database: any;
  unitName: any;
  maeriProduct: any;
  productPick: Array<any>;
  displayProduct: Array<any> = [];
  selectProductList: Array<any> = [];
  resourceList: any;
  uris: any;
  supcategories: Array<any>;
  categorystabSup: Array<any>;
  supcatId: any;
  cheker = 0;
  userStore = [];
  storeId: any;
  multistore = false;
  userProducts = [];
  public sockets;
  adminId: any;
  page: string;
  constructor(
    navParams: NavParams,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private resourceService: ResourcesService,
    private urlService: UrlService,
    private createPack: CreatepackService,
    public notification: NotificationService,
    private catService: CatService
  ) {
    this.takeUrl();
    // this.getSupCategories();
    this.database = localStorage.getItem('adminemail');
    this.getCategories();
    //this.getResources();
    this.data = navParams.get('tabproducts');
    this.products = this.data['products'];
    this.page = navParams.get('page');
    this.productAdd();
    if (this.products) {
      console.log(this.products);
      //  this.productPick = this.products;
      // this.productAdd();
    }
    if (this.data['flag'] === 'product_add') {
      this.flag = true;
    }
    if (this.data['flag'] === 'product_add_resto') {
      this.flag = false;
    }
    let setting = {};
    if (JSON.parse(localStorage.getItem('setting'))) {
      setting = JSON.parse(localStorage.getItem('setting'))[0];
      console.log(setting);
    }

    if (setting['multi_store'] === 'true') {
      this.multistore = true;
      console.log(this.multistore);
    } else {
      /* let user = JSON.parse(localStorage.getItem('user'));
      this.userStore = user[0]['storeId'];
      console.log(this.userStore);
      let id = this.userStore[0]['id'];
      this.productPick.forEach((elt) => {
        elt['storeId'] = id;
      });
      console.log(this.productPick);*/
    }
  }

  ionViewDidEnter() {
    // localStorage.setItem("user", JSON.stringify(firstRes["user"]));
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    console.log(this.userStore);
  }

  ngOnInit() {}

  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.uris = data;
      this.url = data;
      console.log('uri add', data);
      this.adminId = localStorage.getItem('adminId');
      // this.webServerSocket(this.adminId);
    });
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
    console.log(form);
    let postData = {};
    this.presentLoading();
    var formData = new FormData();
    await formData.append('categoryId', this.categorystab['_id']);
    await formData.append('name', form.name);
    await formData.append('capacity', form.capacity);
    await formData.append('purchasingPrice', form.purchasingPrice);
    await formData.append('sellingPrice', form.sellingPrice);
    await formData.append('description', form.description);

    if (form.sizeUnit) {
      await formData.append('sizeUnit', form.sizeUnit);
    }
    if (this.unitName) {
      await formData.append('unitName', this.unitName);
    }

    if (this.maeriProduct) {
      postData['categoryId'] = this.categorystab['_id'];
      postData['name'] = form.name;
      postData['capacity'] = form.capacity;
      postData['purchasingPrice'] = form.purchasingPrice;
      postData['sellingPrice'] = form.sellingPrice;
      postData['description'] = form.description;
      postData['filename'] = this.maeriProduct.filename;
      postData['originalName'] = this.maeriProduct.originalName;
      // if maeri product
      console.log(postData);

      this.restApi.addProductFromMaeri(postData).subscribe((data) => {
        console.log(data);
        this.dismissLoading();
        this.presentToast();

        data[
          'data'
        ].url = `${this.uris}maeriproducts/${data['data']._id}?db=${this.database}`;
        console.log(this.products);
        // this.products.unshift(data["data"]);
        //add item manufactured product
        data['data']['productId'] = data['data']['_id'];
        delete data['data']['_id'];
        delete data['data']['productitems'];
        delete data['data']['filename'];
        delete data['data']['originalName'];
        delete data['data']['lemballus'];
        delete data['data']['originalName'];

        console.log("je 'envoi", data['data']);
        if (data['data']['sizeUnit']) {
          data['data']['sizeUnitProduct'] = data['data']['sizeUnit'];
        }
        if (data['data']['unitName']) {
          data['data']['unitNameProduct'] = data['data']['unitName'];
        }
        this.restApi.addProductItem(data['data']).subscribe((elt) => {
          console.log(elt);
        });
      });
    } else {
      await formData.append('image', this.file);
      this.restApi.addProduct(formData).subscribe((data) => {
        this.dismissLoading();
        this.presentToast();
        // data["data"].url = this.restApi.getProducById(data["data"]._id);
        // console.log(this.products);
        data[
          'data'
        ].url = `${this.uris}maeriproducts/${data['data']._id}?db=${this.database}`;
        console.log(this.products);
        // this.products.unshift(data["data"]);
        //add item manufactured product
        data['data']['productId'] = data['data']['_id'];
        delete data['data']['_id'];
        delete data['data']['productitems'];
        delete data['data']['filename'];
        delete data['data']['originalName'];
        delete data['data']['lemballus'];
        delete data['data']['originalName'];

        console.log("je 'envoi", data['data']);
        if (data['data']['sizeUnit']) {
          data['data']['sizeUnitProduct'] = data['data']['sizeUnit'];
        }
        if (data['data']['unitName']) {
          data['data']['unitNameProduct'] = data['data']['unitName'];
        }
        console.log("je 'envoi", data['data']);
        this.restApi.addProductItem(data['data']).subscribe((elt) => {
          console.log(elt);
        });
      });
    }
  }

  async postManufactyred(form) {
    this.presentLoading();
    if (this.maeriProduct) {
      this.maeriManufactured(form);
    } else {
      var formData = new FormData();
      await formData.append('categoryId', this.categorystab['_id']);
      await formData.append('name', form.value.name);
      await formData.append('sellingPrice', form.value.sellingPrice);
      await formData.append('description', form.value.description);
      await formData.append('image', this.file);
      await formData.append('source', 'maeri');
      if (this.resourceList) {
        await formData.append('resourceList', this.resourceList);
      }

      this.restApi.addProductManufactured(formData).subscribe((data) => {
        console.log(data);
        this.dismissLoading();
        this.presentToast();
        // data["data"].url = this.restApi.getProducById(data["data"]._id);
        data[
          'data'
        ].url = `${this.uris}maeriproducts/${data['data']._id}?db=${this.database}`;
        console.log(this.products);
        // this.products.unshift(data["data"]);
        //add item manufactured product
        data['data']['productId'] = data['data']['_id'];
        data['data']['resourceList'] = this.resourceList;
        // delete data["data"]["_id"];
        this.restApi
          .addProductManufacturedItem(data['data'])
          .subscribe((elt) => {
            console.log(elt);
          });
      });
    }
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
  }

  takeResources(ev: Event) {
    let datas = ev.target['value'];
    this.resourceList = [];
    this.resources.forEach((elt) => {
      if (datas.includes(elt['_id'])) {
        this.resourceList.push(elt);
      } else {
        console.log('rien');
      }
    });
    console.log(this.resourceList);
  }

  unitMeasure(ev: Event) {
    this.unitName = ev.target['value'];
  }

  closeModal() {
    // this.modalController.dismiss(this.products);;

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
  pickProduct() {
    //this.router.navigateByUrl("pick-product");
    this.productAdd();
  }

  takeMaeriProducts() {
    this.restApi.getMaeriProduct2().subscribe((data) => {
      console.log('incomming maeri prod===>', data);
      let tabs = [];
      tabs = data['message'];
      if (this.products.length) {
        this.products.forEach((prod) => {
          tabs.forEach((elt, i) => {
            if (elt._id == prod.maeriId) {
              elt['pick'] = true;
            }
          });

          /**/
        });
      }
      this.displayProduct = tabs;
    });
  }

  async productAdd() {
    this.takeMaeriProducts();

    /* const modal = await this.modalController.create({
      component: PickProductPage,
      componentProps: {
        tabproducts: { products: this.products, flag: 'product_add' },
      },
    });
    modal.onDidDismiss().then((data) => {
      if (data['data'] === 'close') {
        this.productPick = [];
        setTimeout(() => {
          console.log('close add');

          this.closeModal();
        });
      } else {
        this.getSupCategories();
        this.productPick = data['data']['pick'];
        let user = JSON.parse(localStorage.getItem('user'));
        this.userStore = user[0]['storeId'];
        if (this.userStore.length == 1) {
          let user = JSON.parse(localStorage.getItem('user'));
          this.userStore = user[0]['storeId'];
          let id = this.userStore[0]['id'];
          this.productPick.forEach((elt) => {
            elt['storeId'] = id;
          });
        } else {
        }

        this.userProducts = this.products;
      }
    });
    return await modal.present();*/
  }
  sendPrice(val) {
    return val;
  }
  changePrice(ev, row, field) {
    // console.log(ev);
    console.log(ev.detail.value);
    console.log(row);

    if (!ev.detail.value) {
      ev.detail.value = 0;
    }

    row[field] = parseInt(ev.detail.value);
    console.log(row[field]);
    console.log(row);
  }

  removeProduct(i) {
    this.productPick.splice(i, 1);
  }
  quantity(prod) {
    console.log(prod);
  }

  async pickResource(row) {
    console.log('ok', row);
    const modal = await this.modalController.create({
      component: PickResourcePage,
      componentProps: {
        tabs: this.resourceList,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      if (data['data']) {
        row['resourceList'] = data['data'];
      }
      console.log(row);
    });
    return await modal.present();
  }

  maeriManufactured(form) {
    let postData = {};

    postData['categoryId'] = form.categoryId;
    postData['name'] = form.name;
    postData['sellingPrice'] = form.sellingPrice;
    postData['description'] = form.description;
    postData['filename'] = form.filename;
    postData['originalName'] = form.originalName;
    postData['produceBy'] = form.produceBy;
    postData['superCategory'] = form.superCategory;
    postData['url'] = form.url;
    postData['categoryName'] = form.categoryName;
    postData['maeriId'] = form._id;
    postData['storeId'] = form.storeId;
    if (form.resourceList) {
      postData['resourceList'] = form.resourceList;
    }
    console.log("j'ajoute", postData);

    this.restApi.addProductMaeriManufactured(postData).subscribe((data) => {
      this.presentToast();
      // this.products.unshift(data["data"]);
      /*  data['data']['productId'] = data['data']['_id'];
      data['data']['resourceList'] = form.resourceList;
      this.restApi.addProductManufacturedItem(data['data']).subscribe((elt) => {
        console.log(elt);
      }); */
    });
  }

  sendToServer() {
    this.notification.presentLoading();
    setTimeout(() => {
      this.closeModal();
    }, 500);
    let pro = zip(from(this.selectProductList), interval(100)).pipe(
      map(([prod]) => prod)
    );
    pro.subscribe(
      (data) => {
        this.cheker = this.cheker + 1;
        this.Envoi(data);
      },
      (err) => {},
      () => {
        this.notification.dismissLoading();
      }
    );
  }

  sendManufToServer() {
    // this.dismissLoading();
    this.modalController.dismiss(this.products);
    let pro = zip(from(this.productPick), interval(100)).pipe(
      map(([prod]) => prod)
    );
    pro.subscribe((data) => {
      this.cheker = this.cheker + 1;
      this.maeriManufactured(data);
    });
  }
  async Envoi(form) {
    if (this.cheker === this.productPick.length) {
    }

    console.log(form);
    let postData = {};

    postData['categoryId'] = form.categoryId;
    postData['name'] = form.name;
    postData['capacity'] = form.capacity;
    postData['purchasingPrice'] = form.purchasingPrice;
    postData['sellingPrice'] = form.sellingPrice;
    postData['description'] = form.description;
    postData['filename'] = form.filename;
    postData['originalName'] = form.originalName;
    postData['url'] = form.url;
    postData['maeriId'] = form._id;
    postData['sizeUnit'] = form.sizeUnit;
    postData['unitName'] = form.unitName;
    postData['produceBy'] = form.produceBy;
    postData['packSize'] = form.packSize;
    postData['packPrice'] = form.packPrice;
    postData['categoryName'] = form.categoryName;
    postData['superCategory'] = 'bar';
    postData['storeId'] = form.storeId;

    // if maeri product
    ///  console.log(postData);

    this.restApi.addProductFromMaeri(postData).subscribe(
      (data) => {
        // this.products.unshift(data["data"]);
        let productId = data['data']['_id'];
        data['data']['productId'] = data['data']['_id'];
        delete data['data']['_id'];
        delete data['data']['productitems'];
        delete data['data']['filename'];
        delete data['data']['originalName'];
        delete data['data']['lemballus'];
        delete data['data']['originalName'];
        data['data']['url'] = form.url;
        data['data']['packSize'] = form.packSize;
        data['data']['packPrice'] = form.packPrice;

        if (data['data']['sizeUnit']) {
          data['data']['sizeUnitProduct'] = data['data']['sizeUnit'];
        }
        if (data['data']['unitName']) {
          data['data']['unitNameProduct'] = data['data']['unitName'];
        }
        console.log('product item to add ====>', data['data']);

        /* this.restApi.addProductItem(data['data']).subscribe(
          (elt) => {
            console.log(elt);
            elt['data']['packSize'] = form['packSize'];
            elt['data']['packPrice'] = form['packPrice'];
            elt['data']['productId'] = productId;
            this.createPack.registerPack(
              elt['data'],
              productId,
              elt['data']['_id']
            );
          },
          (err) => {
            this.notification.presentToast(err.error.error, 'danger');
          }
        );
        if (this.productPick.length) {
          this.productPick = [];
        } */
      },
      (err) => {
        // console.log(err);
        this.notification.presentToast(err.error.error, 'danger');
      }
    );
  }
  getSupCategories() {
    /* this.categorieSerice.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.supcategories = data["category"];
    }); */
    let user = JSON.parse(localStorage.getItem('user'));
    this.supcategories = user[0]['storeType'];
  }

  getCategories() {
    this.categorieSerice.getCategories().subscribe((data) => {
      this.getMaeriCategories();
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });
    });
  }

  getMaeriCategories() {
    this.catService.getMarieCategories().subscribe((data) => {
      // console.log(data);
      /* let tab = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });*/
      let tab = data['category'];
      this.categorys = [...this.categorys, ...tab];
    });
  }

  test2(ev: Event, i) {
    console.log(ev.target['value']);
    //  this.supcatId = ev.target["value"];

    /* this.categorystabSup = this.supcategories.filter(
      (item) => item["_id"] === this.supcatId
    )[0];*/
    //this.productPick[i]["superCategory"] = this.supcatId;
    this.productPick[i]['categoryName'] = ev.target['value'];

    this.selectProductList.forEach((p) => {
      if (p._id == this.productPick[i]._id) {
        p['categoryName'] = ev.target['value'];
      }
    });
  }
  selectProduct(prod, i) {
    if (!prod['pick']) {
      this.productPick[i] = true;
      this.selectProductList.push(this.productPick[i]);
    } else {
      this.productPick[i] = false;
      this.selectProductList = this.selectProductList.filter(
        (p) => prod._id == p._id
      );
    }
  }

  async assignStore(ev: Event, i) {
    let id = ev.target['value'];
    this.productPick[i]['storeId'] = id;
    this.selectProductList.forEach((p) => {
      if (p._id == this.productPick[i]._id) {
        p['storeId'] = id;
      }
    });

    /* let index = this.userProducts.findIndex((elt) => {
      return elt['storeId'] == id && this.productPick[i]['_id'] == elt.maeriId;
    });
    if (index >= 0) {
      console.log(index);
      this.notification.presentAlert(
        'ce produit existe déja dans le store selectioné'
      );
    } else {
      this.productPick[i]['storeId'] = id;
    }*/
  }

  async assignStoreManufactured(ev: Event, i) {
    let id = ev.target['value'];
    // this.productPick[i]["storeId"] = id;
    console.log(id);
    console.log(this.userProducts);
    let index = this.userProducts.findIndex((elt) => {
      console.log(elt);

      return elt['storeId'] == id && this.productPick[i]['_id'] == elt.maeriId;
    });
    if (index >= 0) {
      console.log(index);
      this.notification.presentAlert(
        'ce produit existe déja dans le store selectioné'
      );
    } else {
      this.productPick[i]['storeId'] = id;
    }
  }
}
