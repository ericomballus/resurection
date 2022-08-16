import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { CatService } from 'src/app/services/cat.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import {
  ModalController,
  NavParams,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { environment, uri } from '../../../environments/environment';
import { Router } from '@angular/router';
import { PickProductPage } from 'src/app/pick-product/pick-product.page';
import { ResourcesService } from 'src/app/services/resources.service';
import { PickResourcePage } from 'src/app/pick-resource/pick-resource.page';
import { Animation, AnimationController } from '@ionic/angular';
import { FormGroup, NgForm } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-product-manufactured-user',
  templateUrl: './product-manufactured-user.page.html',
  styleUrls: ['./product-manufactured-user.page.scss'],
})
export class ProductManufacturedUserPage implements OnInit {
  @ViewChildren('itemlist', { read: ElementRef }) items: any;
  @ViewChildren('totalCoaste', { read: ElementRef }) totalCoastRef: any;
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
  unitName: any;
  maeriProduct: any;
  resourceList: any;
  userStore = [];
  storeID: any;
  purchasingPrice: 0;
  totalCoast = 0;
  categorie = '';
  page = '';
  saleToRetailer = false;
  constructor(
    navParams: NavParams,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private resourceService: ResourcesService,
    private animationCtrl: AnimationController,
    private notifi: NotificationService
  ) {
    this.database = localStorage.getItem('adminemail');
    this.data = navParams.get('tabproducts');
    this.products = this.data['products'];
    this.page = this.data['page'];
    this.getCategories();
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    this.storeID = this.userStore[0]['id'];
  }

  ngOnInit() {}
  ionViewDidEnter() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    if (JSON.parse(localStorage.getItem('saleToRetailer'))) {
      this.saleToRetailer = true;
    }
  }
  readUrl(event: any) {
    this.file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async postManufactyred(form) {
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }
    this.presentLoading();
    var formData = new FormData();
    await formData.append('categoryId', this.categorystab['_id']);
    await formData.append('categoryName', this.categorystab['name']);
    await formData.append('superCategory', 'resto');
    await formData.append('name', form.value.name);
    await formData.append('sellingPrice', form.value.sellingPrice);
    await formData.append('description', form.value.description);
    await formData.append('source', 'user');
    await formData.append('image', this.file);
    if (form.value.retailerPrice) {
      await formData.append('retailerPrice', form.value.retailerPrice);
    }

    if (this.storeID) {
      await formData.append('storeId', this.storeID);
    }
    if (form.value.size) {
      await formData.append('size', form.value.size);
    }
    if (this.resourceList) {
      await formData.append('resourceList', JSON.stringify(this.resourceList));
    } else {
      await formData.append('resourceList', JSON.stringify([]));
    }
    if (form.value.purchasingPrice) {
      formData.append('purchasingPrice', form.value.purchasingPrice);
    } else {
      formData.append('purchasingPrice', '0');
    }
    let company = localStorage.getItem('company');
    formData.append('produceBy', company);

    this.restApi.addProductManufactured(formData).subscribe((data) => {
      console.log(data);
      this.dismissLoading();
      this.presentToast();
      this.modalController.dismiss();
      /*  
      data[
        'data'
      ].url = `${uri}products_resto/${data['data']._id}?db=${this.database}`;
     
      if (this.products) {
        this.products.unshift(data['data']);
      }
     
      data['data']['productId'] = data['data']['_id'];
      data['data']['resourceList'] = this.resourceList;
      
      this.restApi.addProductManufacturedItem(data['data']).subscribe((elt) => {
        console.log(elt);
        this.dismissLoading();
        this.modalController.dismiss();
      });
      */
    });
  }

  getCategories() {
    this.getSupCategories();
    this.categorieSerice.getCategories().subscribe((data) => {
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
      });
    });
  }
  getSupCategories() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.supcategories = user[0]['storeType'];
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
  }

  test2(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    this.supcatId = ev.target['value'];

    this.categorystabSup = this.supcatId;
    /* this.supcategories.filter(
      (item) => item["_id"] === this.supcatId
    )[0]; */

    console.log(this.categorystabSup);
  }

  takeResources(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
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
    console.log(this.page);
    this.resourceList = this.resourceList.filter((elt) => {
      if (elt.page) {
        return elt.page == this.page;
      }
    });
  }

  unitMeasure(ev: Event) {
    console.log(ev.target['value']);
    this.unitName = ev.target['value'];
  }
  async assignStore(ev) {
    let id = ev.target['value'];
    console.log(id);
    this.storeID = id;
    // console.log(this.userStore);
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
  pickProduct() {
    //this.router.navigateByUrl("pick-product");
    this.productAdd();
  }
  async productAdd() {
    const modal = await this.modalController.create({
      component: PickProductPage,
      componentProps: {
        tabproducts: { products: this.products, flag: 'product_add' },
        //  tabproducts: { products: [], flag: "product_add" }
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      // this.products = data["data"];
      this.maeriProduct = data['data'];
      this.url = this.maeriProduct['url'];
    });
    return await modal.present();
  }

  quantity(prod) {
    console.log(prod);
  }

  async pickResource() {
    console.log('ok');
    console.log(this.resourceList);

    const modal = await this.modalController.create({
      component: PickResourcePage,
      componentProps: {
        tabs: this.resourceList,
        page: this.page,
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
  //assignStore($event, i){}
  deleteResource(res, index) {
    console.log(this.totalCoastRef['_results']);

    const squareB: Animation = this.animationCtrl
      .create()
      // .addElement(coastRef)
      .addElement(document.querySelector('.totalCoast'))
      .duration(2000)
      .beforeStyles({
        opacity: 0.2,
      })
      .afterStyles({
        background: 'rgba(0, 255, 0, 0.5)',
      })
      .afterClearStyles(['opacity'])
      .keyframes([
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.5, transform: 'scale(1.5)' },
        { offset: 1, transform: 'scale(1)' },
      ]);
    let myElementRef = this.items['_results'][index]['nativeElement'];
    const animation: Animation = this.animationCtrl
      .create()
      // .addElement(document.querySelector(".remove-me"))
      .addElement(myElementRef)
      .duration(800)
      // .iterations(Infinity)
      .fromTo('transform', 'translateX(0px)', 'translateX(100px)')
      .fromTo('opacity', '1', '0.2');
    animation.play().then(() => {});
    setTimeout(() => {
      animation.stop();
      this.resourceList = this.resourceList.filter((resource) => {
        return resource.resourceId !== res.resourceId;
      });
      this.totalCoast = 0;
      this.resourceList.forEach((resource) => {
        this.totalCoast = this.totalCoast + resource.coast;
      });
      squareB.play().then(() => {
        console.log('total coast load');
      });
    }, 800);
  }
}
