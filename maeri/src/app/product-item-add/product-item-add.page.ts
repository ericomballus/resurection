import { Component, OnInit } from "@angular/core";
import { RestApiService } from "../services/rest-api.service";
import { ModalController, AlertController } from "@ionic/angular";
import { ProductItemModalPage } from "../product-item-modal/product-item-modal.page";
@Component({
  selector: "app-product-item-add",
  templateUrl: "./product-item-add.page.html",
  styleUrls: ["./product-item-add.page.scss"]
})
export class ProductItemAddPage implements OnInit {
  products: any;
  constructor(
    private restApiService: RestApiService,
    public modalController: ModalController,
    public alertController: AlertController
  ) {
    this.takeProduct();
  }

  ngOnInit() {}
  takeProduct() {
    this.restApiService.getProductList().subscribe(data => {
      console.log(data);
      this.products = data["products"];
    });
  }
  /*
  createproduct(prod) {
    console.log(prod);
  }
*/
  async createProduct(product) {
    const modal = await this.modalController.create({
      component: ProductItemModalPage,
      componentProps: {
        product: product
      }
    });
    modal.onDidDismiss().then(data => {
      console.log(data);
      this.presentAlert(data);
    });
    return await modal.present();
  }

  async presentAlert(data) {
    const alert = await this.alertController.create({
      header: "ELPIS",
      //  subHeader: data.data.createdOrder.name,
      //  message: data.data.message,
      buttons: ["OK"]
    });

    await alert.present();
  }
}
