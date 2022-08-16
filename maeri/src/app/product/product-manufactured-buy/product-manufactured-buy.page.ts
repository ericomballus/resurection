import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  AlertController,
  ModalController,
  NavController,
  IonSlides,
} from "@ionic/angular";
import { Socket } from "ngx-socket-io";
import { Router } from "@angular/router";
import { ManageCartService } from "../../services/manage-cart.service";
import { RestApiService } from "../../services/rest-api.service";
import { CartPage } from "../../cart/cart.page";
@Component({
  selector: "app-product-manufactured-buy",
  templateUrl: "./product-manufactured-buy.page.html",
  styleUrls: ["./product-manufactured-buy.page.scss"],
})
export class ProductManufacturedBuyPage implements OnInit {
  manufacturedItem = [];
  totalItems = 0;
  totalPrice = 0;
  cartValue: any;
  constructor(
    public restApiService: RestApiService,
    public manageCartService: ManageCartService,
    public navCtrl: NavController,
    public modalController: ModalController,
    public alertController: AlertController,
    private router: Router,
    public loadingController: LoadingController,
    private socket: Socket
  ) {
    this.takeProduct();
  }

  ngOnInit() {}
  takeProduct() {
    this.restApiService.getManufacturedProductItemResto2().subscribe((data) => {
      console.log(data);
      //this.products = data["items"];
      this.manufacturedItem = data;
    });
  }

  buyItem(prod) {
    console.log(prod);

    let id = prod._id;

    this.cartValue = this.restApiService.getCart2();
    // console.log("la valeur du cart", this.cartValue);

    if (this.cartValue && this.cartValue["cart"]) {
      let data = {};
      data["product"] = prod;
      data["cart"] = this.cartValue["cart"];
      let cart = this.manageCartService.addToCart(data);

      this.totalItems = cart["totalQty"];
      this.totalPrice = cart["totalPrice"];
      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.manufacturedItem.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod["qty"] = b[0]["qty"];
      // console.log("hello2", prod);
      this.manufacturedItem.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    } else {
      let cart = this.manageCartService.addToCart(prod);
      //  console.log(cart);
      //  console.log(cart.generateArray());
      this.totalItems = cart["totalQty"];
      this.totalPrice = cart["totalPrice"];
      let b = [];
      b = cart.generateArray().filter((elt) => {
        return elt.item._id === id;
      });
      let index = this.manufacturedItem.findIndex((elt) => {
        return elt._id === prod._id;
      });
      prod["qty"] = b[0]["qty"];
      //  console.log("hello2", prod);
      this.manufacturedItem.splice(index, 1, prod);

      this.manufacturedItem.splice(index, 1, prod);

      this.restApiService.saveCart({
        cart: cart,
        products: cart.generateArray(),
      });
    }
  }

  async openCart() {
    console.log("hello...");

    const modal = await this.modalController.create({
      component: CartPage,
      componentProps: {
        commande: true,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
      this.takeProduct();
      this.restApiService.saveCart({});
      if (data["data"]["cart"]) {
        this.totalItems = data["data"]["cart"]["totalQty"];
        this.totalPrice = data["data"]["cart"]["totalPrice"];
      } else {
        this.totalItems = 0;
        this.totalPrice = 0;
      }
    });
    return await modal.present();
  }
}
