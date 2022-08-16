import { Component, OnInit } from '@angular/core';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ModalController } from '@ionic/angular';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-add-consigne',
  templateUrl: './add-consigne.page.html',
  styleUrls: ['./add-consigne.page.scss'],
})
export class AddConsignePage implements OnInit {
  allCart: any;
  consigneObj = {};
  randomVal: any;
  canSelectQty: boolean = false;
  customPopoverOptions: any = {
    message: 'type de consigne',
  };
  constructor(
    public rest: RestApiService,
    public saveRandom: SaverandomService,
    private modalController: ModalController,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    this.getCart();
  }
  getCart() {
    this.rest.getCart().subscribe((data) => {
      this.allCart = data;
    });
    console.log(this.allCart);
  }
  getCassierValue(ev, row) {
    let val = parseInt(ev.detail.value);

    let id = row.item._id;
    if (val) {
      if (val > row.item.CA) {
        this.notification.presentError(
          'impossible la consigne ajouté es supérieur au nombre de cassiers achetés',
          'danger'
        );
        return;
      }
      if (this.consigneObj[id]) {
        this.consigneObj[id]['cassier'] = val;
      } else {
        this.consigneObj[id] = {
          cassier: val,
          item: row.item,
          productId: id,
          price: 0,
        };
      }
    } else {
      if (this.consigneObj[id]) {
        this.consigneObj[id]['cassier'] = 0;
      }
    }
  }

  getBouteilleValue(ev, row) {
    let val = parseInt(ev.detail.value);

    let id = row.item._id;
    if (val) {
      if (val > row.item.BTL + row.item.CA) {
        this.notification.presentError(
          'impossible la consigne ajouté es supérieur au nombre de bouteilles achetés',
          'danger'
        );
        return;
      }
      if (this.consigneObj[id]) {
        this.consigneObj[id]['bouteille'] = val;
      } else {
        this.consigneObj[id] = {
          bouteille: val,
          item: row.item,
          productId: id,
          price: 0,
        };
      }
    } else {
      if (this.consigneObj[id]) {
        this.consigneObj[id]['bouteille'] = 0;
      }
    }
  }

  getConsigneCoast(ev, row) {
    let val = parseInt(ev.detail.value);
    let id = row.item._id;
    if (val) {
      if (this.consigneObj[id]) {
        this.consigneObj[id]['price'] = val;
      } else {
        this.notification.presentToast(
          'unable to add price to empty quantity, please provide some quantity before',
          'danger'
        );
      }
    } else {
      if (this.consigneObj[id]) {
        this.consigneObj[id]['price'] = 0;
      }
    }
    console.log(this.consigneObj);
  }

  closeModal() {
    this.modalController.dismiss(this.allCart);
  }

  save() {
    let tab = this.generateArray(this.consigneObj);
    this.modalController.dismiss({
      consigne: tab,
    });
  }

  generateArray(items) {
    const arr = [];
    for (var id in items) {
      arr.push(items[id]);
    }
    return arr;
  }
}
