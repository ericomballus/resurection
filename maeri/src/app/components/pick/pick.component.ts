import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChildren,
  ElementRef,
} from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-pick',
  templateUrl: './pick.component.html',
  styleUrls: ['./pick.component.scss'],
})
export class PickComponent implements OnInit {
  @Output() valueChange = new EventEmitter();
  @Input() public multiStoreProducts: any[];
  tab = [1, 2, 3];
  title = '';
  storeName = null;

  constructor(private saveRandom: SaverandomService) {
    // setTimeout(() => {
    //  console.log('ici le paradis', this.multiStoreProducts);
    //}, 2000);
  }

  ngOnInit() {
    setTimeout(() => {
      if (this.multiStoreProducts['storeName']) {
        this.storeName = this.multiStoreProducts['storeName'];
      }
      this.alreadyChosen();
    }, 3000);
  }

  pickProduct(prod) {
    let retailer = this.saveRandom.getRetailer();
    let productsToSale: any[] = retailer['productsToSale'];
    if (prod['pick']) {
      prod['pick'] = !prod['pick'];
      productsToSale = productsToSale.filter((p) => {
        return prod._id !== p['_id'];
      });
    } else {
      prod['pick'] = true;
      productsToSale.push(prod);
    }
    retailer['productsToSale'] = productsToSale;
    this.saveRandom.setRetailer(retailer);
    // console.log(this.saveRandom.getRetailer());
  }

  segmentChanged(ev: any) {}

  alreadyChosen() {
    let retailer = this.saveRandom.getRetailer();
    let productsToSale: any[] = retailer['productsToSale'];
    this.multiStoreProducts.forEach((prod) => {
      let index = productsToSale.findIndex((elt) => {
        return elt._id == prod._id;
      });
      if (index >= 0) {
        prod['pick'] = true;
      } else {
        prod['pick'] = false;
      }
    });
  }
}
