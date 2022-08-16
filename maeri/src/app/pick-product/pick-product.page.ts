import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { ModalController, ToastController, NavParams } from '@ionic/angular';
import io from 'socket.io-client';
import { UrlService } from 'src/app/services/url.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pick-product',
  templateUrl: './pick-product.page.html',
  styleUrls: ['./pick-product.page.scss'],
})
export class PickProductPage implements OnInit {
  products: any;
  tab: Array<any> = [];
  userProduct: Array<any>;
  public sockets;
  public url;
  userStore = [];
  constructor(
    navParams: NavParams,
    public restApi: RestApiService,
    private modalController: ModalController,
    public urlService: UrlService,
    public router: Router
  ) {
    this.userProduct = navParams.get('tabproducts')['products'];
    console.log(this.userProduct);
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    this.takeUrl();
    this.takeMaeriProducts();
  }

  ngOnInit() {}

  takeMaeriProducts() {
    this.restApi.getMaeriProduct().subscribe((data) => {
      // console.log(data);
      this.alreadyChosen(data);
      this.products = data;
    });
  }

  alreadyChosen(data) {
    this.userProduct.forEach((prod) => {
      data.forEach((elt) => {
        let index = elt['entry'].findIndex((elt) => {
          return elt._id == prod.maeriId;
        });
        if (index >= 0) {
          if (prod['desabled']) {
          } else {
            elt['entry'][index]['exist'] = true;
          }
        }
        // elt["entry"][index]["exist"] = true;
      });
      /**/
    });
  }

  buyItem(prod) {
    console.log(prod);
  }
  closeModal() {
    // this.modalController.dismiss(this.products);
    this.modalController.dismiss('close');
  }
  pickProduct(prod) {
    if (prod['pick']) {
      prod['pick'] = false;
      this.tab = this.tab.filter((elt) => {
        return elt._id !== prod._id;
      });
    } else {
      prod['pick'] = true;
      this.tab.push(prod);
    }

    // ;
  }

  done() {
    this.modalController.dismiss({
      pick: this.tab,
      userProd: this.userProduct,
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
      data['prod']['url'] = data['url'];
      this.products.unshift(data['prod']);
    });
  }
}
