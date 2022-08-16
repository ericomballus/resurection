import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ManageCartService } from 'src/app/services/manage-cart.service';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { Router } from '@angular/router';
import { CartPage } from 'src/app/cart/cart.page';
@Component({
  selector: 'app-employees-retailer-sale',
  templateUrl: './employees-retailer-sale.page.html',
  styleUrls: ['./employees-retailer-sale.page.scss'],
})
export class EmployeesRetailerSalePage implements OnInit {
  products = [];
  storeType = [];
  tabNotif = [];
  productList: any;
  arr = [];
  arrList = [];
  arrListRandom = [];
  storeTypeTab = [];
  productServiceTab: any;
  productListTab: any;
  productListGroup: any;
  multiStoreList: any;
  multiStoreService: any;
  pet: any;
  // ttl = 60 * 60 * 2;
  saleToPack = false;
  constructor(
    public modalController: ModalController,
    private saveRandom: SaverandomService,
    private restApiService: RestApiService,
    public rangeByStoreService: RangeByStoreService,
    private manageCartService: ManageCartService,
    private router: Router
  ) {
    this.getItems();
    this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
      'storeType'
    ];
    if (
      this.storeTypeTab.includes('bar') ||
      this.storeTypeTab.includes('resto')
    ) {
      // this.storeTypeTab.push('resource');
    }
  }

  ngOnInit() {}
  closeModal() {
    this.modalController.dismiss('erico');
  }

  getItems() {
    setTimeout(() => {
      // this.takeProduct();
    }, 500);
  }
}
/*

          retailerTabProduct.forEach((child) => {
          data.forEach((parent) => {
            if (parent._id == child._id) {
              parent['retailerPrice'] = child['retailerPrice'];
              parent['sellingPrice'] = child['retailerPrice'];
              parent['purchasingPrice'] = child['retailerPrice'];
              parent['sellingPackPrice'] =
                child['retailerPrice'] * parent['packSize'];
              parent['packPrice'] = child['retailerPrice'] * parent['packSize'];
              return;
            }
          });
        });

        retailerTabProduct.forEach((child) => {
          let tab = data.filter((parent) => {
            return parent._id == child._id;
          });
          if (tab.length) {
            tab[0]['retailerPrice'] = child['retailerPrice'];

            this.products = [...this.products, ...tab];
          }
        });
      }


*/
