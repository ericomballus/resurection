import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";

@Component({
  selector: "app-confim-order",
  templateUrl: "./confim-order.page.html",
  styleUrls: ["./confim-order.page.scss"]
})
export class ConfimOrderPage implements OnInit {
  oderTab = [];
  constructor(navParams: NavParams, private modalController: ModalController) {
    console.log(navParams.get("data"));

    this.oderTab = navParams.get("data");
  }

  ngOnInit() {}

  dismiss(order) {
    this.modalController.dismiss({
      order: order
    });
  }
  Close() {
    this.modalController.dismiss({
      order: false
    });
  }
}
