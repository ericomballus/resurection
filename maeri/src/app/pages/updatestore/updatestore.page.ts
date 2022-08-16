import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-updatestore',
  templateUrl: './updatestore.page.html',
  styleUrls: ['./updatestore.page.scss'],
})
export class UpdatestorePage implements OnInit {
  store = {
    name: '',
    ville: '',
    telephone: '',
    quartier: '',
    super_warehouse: false,
  };
  constructor(
    public navParams: NavParams,
    private modalController: ModalController
  ) {
    console.log(this.navParams.get('store'));
    let result = this.navParams.get('store');
    this.store = { ...this.store, ...result };
    console.log(this.store);
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss(null);
  }

  register(form) {
    this.modalController.dismiss(this.store);
  }
  enableSuperWhareHouse() {
    this.store.super_warehouse = !this.store.super_warehouse;
  }
}
