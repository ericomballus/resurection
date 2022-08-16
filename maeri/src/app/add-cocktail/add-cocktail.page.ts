import {
  Component,
  ElementRef,
  Input,
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
import { environment, uri } from '../../environments/environment';
import { MadebyService } from 'src/app/services/madeby.service';
import { ResourcesService } from '../services/resources.service';
import { PickResourcePage } from '../pick-resource/pick-resource.page';
import { UrlService } from '../services/url.service';
import { CreatepackService } from '../services/createpack.service';
import { Animation, AnimationController } from '@ionic/angular';
import { NotificationService } from '../services/notification.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-add-cocktail',
  templateUrl: './add-cocktail.page.html',
  styleUrls: ['./add-cocktail.page.scss'],
})
export class AddCocktailPage implements OnInit {
  @Input() page: string;
  @ViewChildren('itemlist', { read: ElementRef }) items: any;
  @ViewChildren('totalCoaste', { read: ElementRef }) totalCoastRef: any;
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  totalCoast = 0;
  file: File;
  url: any;
  isLoading: any;
  //flag_product: any;
  description: string;
  categorys: Array<any>;
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
  supcatId: any;
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
    private animationCtrl: AnimationController,
    private notifi: NotificationService
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1)) {
      this.getCategories();
      this.getMade();
      this.admin = true;
      let user = JSON.parse(localStorage.getItem('user'));
      this.userStore = user[0]['storeId'];

      this.storeID = this.userStore[0]['id'].toString();
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
    });
  }
  getSupCategories() {
    this.catService.getCategoriesSup().subscribe((data) => {
      console.log(data);
      this.supcategories = data['category'];
    });
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
    this.supcatId = ev.target['value'];

    this.categorystabSup = this.supcatId;
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
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }

    this.presentLoading();
    var formData = new FormData();
    //form.value["productId"] = this.product["_id"];

    await formData.append('categoryId', this.categorystab['_id']);
    await formData.append('categoryName', this.categorystab['name']);
    await formData.append('name', form.value.name);
    await formData.append('capacity', form.value.capacity);

    await formData.append('sellingPrice', form.value.sellingPrice);
    await formData.append('description', form.value.description);

    formData.append('superCategory', 'bar');

    if (form.value.packPrice) {
      await formData.append('packPrice', form.value.packPrice);
    } else {
      await formData.append('packPrice', '0');
    }

    if (form.value.packSize) {
      await formData.append('packSize', form.value.packSize);
    } else {
      await formData.append('packSize', '1');
    }

    formData.append('storeId', this.userStore[0]['id']);

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
      this.dismissLoading();
      this.presentToast();
      this.modalController.dismiss();
      /* let productId = data["data"]["_id"];
      delete data["data"]["_id"];
      delete data["data"]["productitems"];
      delete data["data"]["filename"];
      delete data["data"]["originalName"];
      delete data["data"]["lemballus"];
      delete data["data"]["originalName"];

      console.log("je 'envoi", data["data"]);
      if (data["data"]["sizeUnit"]) {
        data["data"]["sizeUnitProduct"] = data["data"]["sizeUnit"];
      }
      if (data["data"]["unitName"]) {
        data["data"]["unitNameProduct"] = data["data"]["unitName"];
      }
      this.restApi.addProductItem(data["data"]).subscribe((elt) => {
        console.log(elt);
       

        this.createPack.registerPack(
          elt["data"],
          productId,
          elt["data"]["_id"]
        );
      }); */
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
        page: 'product-list',
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
  async assignStore(ev) {
    let id = ev.target['value'];
    console.log(id);
    this.storeID = id;
    // console.log(this.userStore);
  }

  deleteResource(res, index) {
    /*  let myElementRef = this.items["_results"][index][
      "nativeElement"
    ].classList.add("remove-me");*/
    //let coastRef = this.totalCoastRef["_results"][1]["nativeElement"];
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
