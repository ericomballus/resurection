import { Component, Input, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { PickResourcePage } from '../pick-resource/pick-resource.page';
import { CatService } from '../services/cat.service';
import { NotificationService } from '../services/notification.service';
import { RestApiService } from '../services/rest-api.service';
import { SaverandomService } from '../services/saverandom.service';
import { TranslateConfigService } from '../translate-config.service';

@Component({
  selector: 'app-billard-update',
  templateUrl: './billard-update.page.html',
  styleUrls: ['./billard-update.page.scss'],
})
export class BillardUpdatePage implements OnInit {
  @Input() product: any;
  @Input() page: string;
  categorys: Array<any>;
  categorystab: any;
  userStore: any;
  resourceList = [];
  updateResoure = false;
  useBonus: Boolean = false;
  storeId: any;
  file: File;
  url: any;
  stock_min = 0;
  selectedLanguage: string;
  tabRoles: any[] = [];
  constructor(
    private modalController: ModalController,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    private notif: NotificationService,
    private translateConfigService: TranslateConfigService,
    public saveRandom: SaverandomService
  ) {
    this.getCategories();
  }

  ngOnInit() {
    console.log(this.page);
    console.log(this.product);
    if (!this.product.acceptPrice) {
      this.product.acceptPrice = this.product.sellingPrice;
    }
    if (this.saveRandom.getSetting().sale_Gaz && !this.product.bottle_full) {
      this.product.bottle_full = 0;
    }
    if (this.saveRandom.getSetting().sale_Gaz && !this.product.bottle_empty) {
      this.product.bottle_empty = 0;
    }
    if (this.saveRandom.getSetting().sale_Gaz && !this.product.bottle_total) {
      this.product.bottle_total = 0;
    }
    this.selectedLanguage = this.translateConfigService.getDefaultLanguage();
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    let user = JSON.parse(localStorage.getItem('user'));

    if (this.tabRoles.includes(7)) {
      this.userStore = [];
    } else {
      this.userStore = user[0]['storeId'];
    }
    if (this.product['quantityToAlert']) {
      this.stock_min = this.product['quantityToAlert'];
    }
    let setting = JSON.parse(localStorage.getItem('setting'))[0];
    if (setting && setting['use_bonus']) {
      this.useBonus = true;
    }
    if (this.product['resourceList'] && this.product['resourceList'].length) {
      this.resourceList = this.product['resourceList'];
    }
  }

  assignStore(ev) {
    this.storeId = ev.target.value;
    this.product['storeId'] = this.storeId;
  }

  getCategories() {
    this.categorieSerice.getCategories().subscribe((data) => {
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page || elt.page == this.page + '.page';
        }
        if (elt._id == this.product._id && elt.categoryName) {
          this.product['categoryName'] = elt.categoryName;
        }
      });
      console.log(this.categorys);
    });
  }
  test(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);
    let productId = ev.target['value'];

    this.categorystab = this.categorys.filter(
      (item) => item['_id'] === productId
    )[0];
    this.product['categoryName'] = this.categorystab['name'];
  }
  closeModal() {
    // this.modalController.dismiss(this.products);
    this.modalController.dismiss();
  }
  async update() {
    this.notif.presentLoading();
    if (this.categorystab) {
      this.product['categoryName'] = this.categorystab['name'];
    }
    if (this.stock_min) {
      this.product['quantityToAlert'] = this.stock_min;
    }
    if (this.resourceList.length || this.updateResoure) {
      this.product['resourceList'] = this.resourceList;
    }
    if (this.file) {
      try {
        let photo = this.updateWithFile();
        this.product.filename = photo['filename'];
        this.product.originalname = photo['originalname'];
      } catch (error) {
        console.log(error);
      }
    }
    this.restApi.updateBillardGame(this.product).subscribe((data) => {
      this.notif.dismissLoading();
      data['url'] = this.product['url'];
      this.modalController.dismiss({ product: data });
    });
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
    this.updateResoure = true;
    console.log(this.resourceList);
  }
  readUrl(event: any) {
    this.file = event.target.files[0];

    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.product.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async updateWithFile() {
    return new Promise((resolve, reject) => {
      var formData = new FormData();

      formData.append('image', this.file);
      this.restApi.updateProductWithImage(formData).subscribe(
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
