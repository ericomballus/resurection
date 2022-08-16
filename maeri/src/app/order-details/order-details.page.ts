import { Component, OnInit } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.page.html",
  styleUrls: ["./order-details.page.scss"],
})
export class OrderDetailsPage implements OnInit {
  orders: any;
  sum: any;
  montantR = 0;
  reste = 0;
  userName: any;
  constructor(navParams: NavParams, private modalController: ModalController) {
    this.orders = navParams.get("order");
    console.log(this.orders);
    // this.factories = this.order["products"];
    this.sum = this.orders["commande"]["cartdetails"]["totalPrice"];
    // this.tableNumber = this.orders["tableNumber"];
    this.montantR = this.orders["commande"]["montantRecu"];
    this.reste = this.orders["commande"]["reste"];
    //this.userName = JSON.parse(localStorage.getItem("user"))["name"];
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss("erico");
  }

  confirm() {
    this.modalController.dismiss("confirm");
  }
}
