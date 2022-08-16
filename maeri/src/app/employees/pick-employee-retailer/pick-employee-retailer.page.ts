import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pick-employee-retailer',
  templateUrl: './pick-employee-retailer.page.html',
  styleUrls: ['./pick-employee-retailer.page.scss'],
})
export class PickEmployeeRetailerPage implements OnInit {
  @Input() retailerList: any[];
  constructor(public modalController: ModalController) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  select(retailer) {
    this.modalController.dismiss({
      retailer: retailer,
    });
  }
}
