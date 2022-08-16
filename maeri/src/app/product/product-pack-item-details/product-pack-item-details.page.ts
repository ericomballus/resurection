import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-product-pack-item-details",
  templateUrl: "./product-pack-item-details.page.html",
  styleUrls: ["./product-pack-item-details.page.scss"]
})
export class ProductPackItemDetailsPage implements OnInit {
  prod: any;
  constructor(navParams: NavParams, private modalController: ModalController) {
    this.prod = navParams.get("product");

    console.log(this.prod);
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss("dismiss");
  }
}
