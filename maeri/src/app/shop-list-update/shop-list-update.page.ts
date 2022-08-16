import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CatService } from '../services/cat.service';
import { NotificationService } from '../services/notification.service';
import { RestApiService } from '../services/rest-api.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-shop-list-update',
  templateUrl: './shop-list-update.page.html',
  styleUrls: ['./shop-list-update.page.scss'],
})
export class ShopListUpdatePage implements OnInit {
  @Input() product: any;
  @Input() page: string;
  categorys: Array<any>;
  categorystab: any;
  userStore: any;
  stock_min = 0;
  askQuestions = false;
  constructor(
    private modalController: ModalController,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    private notif: NotificationService,
    public saveRandom: SaverandomService
  ) {
    this.getCategories();
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
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
    if (this.product['quantityToAlert']) {
      this.stock_min = this.product['quantityToAlert'];
    }
  }

  getCategories() {
    this.categorieSerice.getCategories().subscribe((data) => {
      this.categorys = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.page;
        }
        if (elt._id == this.product._id && elt.categoryName) {
          this.product['categoryName'] = elt.categoryName;
        }
      });
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
  update() {
    this.notif.presentLoading();
    if (this.categorystab) {
      this.product['categoryName'] = this.categorystab['name'];
    }
    if (this.stock_min) {
      this.product['quantityToAlert'] = this.stock_min;
    }
    this.restApi.updateShopList(this.product).subscribe((data) => {
      this.notif.dismissLoading();

      this.modalController.dismiss({ product: data });
    });
  }
  assignStore(ev) {}

  async getBouteilleVide(ev) {
    let nbr = parseInt(ev.detail.value);
    this.askQuestions = true;
    if (nbr && nbr > 0) {
      this.product.bottle_empty = nbr;
      if (this.product.bottle_full) {
        this.product.bottle_total =
          this.product.bottle_full + this.product.bottle_empty;
        this.product.quantityStore = this.product.bottle_full;
        this.addToQuantityStore();
      } else {
        this.product.bottle_total = this.product.bottle_empty;
      }
    } else {
      this.product.bottle_empty = 0;
      if (this.product.bottle_full) {
        this.product.bottle_total =
          this.product.bottle_full + this.product.bottle_empty;
        //  this.product.quantityStore = this.product.bottle_full; //quantityStore
        this.addToQuantityStore();
      } else {
        this.product.bottle_total = this.product.bottle_empty;
        this.product.quantityStore = 0;
      }
    }
  }

  async getBouteillePleine(ev) {
    let nbr = parseInt(ev.detail.value);
    this.askQuestions = true;
    if (nbr && nbr > 0) {
      this.product.bottle_full = nbr;
      if (this.product.bottle_empty) {
        this.product.bottle_total =
          this.product.bottle_full + this.product.bottle_empty;
        // this.product.quantityStore = this.product.bottle_full;
      } else {
        if (
          this.product.bottle_total &&
          this.product.bottle_total > this.product.bottle_full
        ) {
          this.product.bottle_empty =
            this.product.bottle_total - this.product.bottle_full;
        } else {
          this.product.bottle_total = this.product.bottle_full;
        }

        // this.product.quantityStore = this.product.bottle_full;
      }
      // this.addToQuantityStore();
    } else {
      this.product.bottle_full = 0;
      // this.product.quantityStore = this.product.bottle_full;
      if (this.product.bottle_empty) {
        this.product.bottle_total =
          this.product.bottle_full + this.product.bottle_empty;
      } else {
        this.product.bottle_total = this.product.bottle_full;
      }
      //this.addToQuantityStore();
    }
  }
  async addToQuantityStore() {
    if (this.askQuestions) {
      try {
        let response = await this.notif.presentAlertConfirm(
          `${this.product.bottle_full} ${this.product.name} en vente ?`,
          'YES',
          'NO'
        );
        this.product.quantityStore = this.product.bottle_full;
        this.product.quantityItems = 0;
      } catch (error) {
        // this.bottle_return = false;
      }
    }
  }
}
