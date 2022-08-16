import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestApiService } from 'src/app/services/rest-api.service';
import { AdminProductUpdatePage } from '../admin-product-update/admin-product-update.page';
import { ModalController } from '@ionic/angular';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { Product } from 'src/app/models/product.model';
@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.page.html',
  styleUrls: ['./admin-products.page.scss'],
})
export class AdminProductsPage implements OnInit {
  products: Array<any>;
  public sockets;
  public url;
  constructor(
    private router: Router,
    private restApi: RestApiService,
    private modalController: ModalController,
    public urlService: UrlService
  ) {
    // this.productIncoming();
  }

  ngOnInit() {
    this.takeUrl();
    this.takeMaeriProducts();
  }

  addProduct() {
    this.router.navigateByUrl('admin-products-add');
  }
  addCategorie() {
    this.router.navigateByUrl('admin-products-categorie');
  }

  addMadeBy() {
    this.router.navigateByUrl('admin-products-madeby');
  }

  takeMaeriProducts() {
    this.restApi.getMaeriProductAdmin().subscribe((data) => {
      console.log(data);
      this.products = data['message'];
    });
  }
  async updateProduct(prod, index) {
    console.log(index);
    const modal = await this.modalController.create({
      component: AdminProductUpdatePage,
      componentProps: {
        products: prod,
        //  tabproducts: { products: [], flag: "product_add" }
      },
    });
    modal.onDidDismiss().then((data) => {
      this.products.splice(index, 1, data.data);
      console.log(data.data);
      // this.products.unshift(data.data);
    });
    return await modal.present();
  }
  deleteProduct(prod) {
    this.restApi.deleteMaeriProduct(prod._id).subscribe((data) => {
      console.log(data);
      this.takeMaeriProducts();
    });
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      console.log(this.url);
      this.productIncoming();
      // alert(this.url);
    });
  }
  productIncoming() {
    this.sockets = io(this.url);
    this.sockets.on('maerinewproduct', (data) => {
      //console.log("depuis client socket");
      // data["url"]= `${this.url}products_resto/${data["data"]._id}`;
      console.log(data);
      data['prod']['url'] = data['url'];

      this.products.unshift(data['prod']);
    });
  }
  displayImg(prod: Product) {
    console.log('loading...');
    return prod.url;
  }
  loading(prod) {
    console.log('loading...2', prod);
    let url = prod.url;
    prod.url = '';
    setTimeout(() => {
      console.log(url);
      prod.url = url;
    }, 5000);
  }
  noImageLoad(prod) {
    console.log('loading...error', prod);
  }
}
