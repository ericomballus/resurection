import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
@Component({
  selector: "app-createstore",
  templateUrl: "./createstore.page.html",
  styleUrls: ["./createstore.page.scss"],
})
export class CreatestorePage implements OnInit {
  store = { name: "", ville: "", telephone: "", quartier: "" };
  constructor(navParams: NavParams, private modalController: ModalController) {}

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss("close");
  }

  register(form) {
    console.log(form);
    console.log(form.value);
    console.log(this.store);
    this.modalController.dismiss(form.value);
  }
}
