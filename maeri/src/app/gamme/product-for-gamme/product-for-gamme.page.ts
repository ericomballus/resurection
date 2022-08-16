import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Gamme } from 'src/app/models/gamme.model';
import { Product } from 'src/app/models/product.model';
import { GammeService } from 'src/app/services/gamme.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { TranslateConfigService } from 'src/app/translate-config.service';

@Component({
  selector: 'app-product-for-gamme',
  templateUrl: './product-for-gamme.page.html',
  styleUrls: ['./product-for-gamme.page.scss'],
})
export class ProductForGammePage implements OnInit {
  productTab: Product[];
  productClone: any[];
  product: Gamme;
  constructor(
    private modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private notification: NotificationService,
    private gammeService: GammeService,
    private notifi: NotificationService,
    private random: SaverandomService
  ) {}

  async ngOnInit() {
    let tab = this.gammeService.getProducts();
    let storeId = this.random.getStoreId();
    console.log('storeId here', storeId);
    if (tab && tab.length) {
      console.log('liste take', tab);
      this.productTab = tab;
    } else {
      if (this.random.getStoreTypeList().includes('services')) {
        this.notifi.presentLoading();
        await this.gammeService.getProductService();
        this.notifi.dismissLoading();
        this.productTab = [
          ...this.productTab,
          ...this.gammeService.getProducts(),
        ];
      }

      /* if (this.random.getStoreTypeList().includes('shop')) {
       
      }*/
    }
    if (this.productTab.length) {
      this.productTab = this.productTab.filter((p) => {
        return p.storeId == storeId;
      });
      this.productTab = this.productTab.sort((c, b) =>
        c.name > b.name ? 1 : -1
      );
      this.product = this.gammeService.getGamme();
      this.productClone = this.gammeService.getGamme().productList;
    }
    this.checkIfSelect();
  }

  closeModal() {
    this.notification.presentLoading();
    this.product.productList = this.productClone;

    this.productTab.forEach((elt) => {
      elt.isChecked = false;
    });
    this.notification.dismissLoading();
    this.modalController.dismiss({ cancel: true });
  }
  saveAndCloseModal() {
    this.notification.presentLoading();
    this.gammeService.setGamme(this.product);
    this.productTab.forEach((elt) => {
      elt.isChecked = false;
    });
    this.notification.dismissLoading();
    this.modalController.dismiss();
  }
  selectProduct(prod: Product) {
    if (!prod['isChecked']) {
      prod['isChecked'] = true;
      prod.toRemove = 1;
      this.product.addToProductList(prod);
      this.gammeService.saveToAddProductList(prod);
    } else {
      prod['isChecked'] = false;
      this.product.removeToProductList(prod);
      this.gammeService.removeToProducList(prod);
    }
  }
  checkIfSelect() {
    if (this.product.productList.length) {
      this.product.productList.forEach((prod) => {
        this.productTab.forEach((elt) => {
          if (elt._id == prod._id) {
            elt.isChecked = true;
          } else {
            // elt.isChecked = false;
          }
        });
      });
      this.productTab.forEach((elt) => {
        if (!elt.isChecked) {
          elt.isChecked = false;
        }
      });
    } else {
      this.productTab.forEach((elt) => {
        elt.isChecked = false;
      });
    }
  }
  getServiceProduct() {}
}
