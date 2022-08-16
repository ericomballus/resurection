import { Component, OnInit } from '@angular/core';
import { AdminService } from '../services/admin.service';
import { ModalController } from '@ionic/angular';
import { Setting } from '../models/setting.models';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-ajouteemploye',
  templateUrl: './ajouteemploye.page.html',
  styleUrls: ['./ajouteemploye.page.scss'],
})
export class AjouteemployePage implements OnInit {
  roles = [];
  tabrole = [];
  setting: Setting;
  constructor(
    public adminService: AdminService,
    private modalController: ModalController,
    private saveRandom: SaverandomService
  ) {
    this.takeUserRoles();
  }

  ngOnInit() {}

  takeUserRoles() {
    this.adminService.getUserRole().subscribe((data) => {
      console.log(data);
      //this.roles = data["roles"];
      let tabRoles = [];
      this.setting = this.saveRandom.getSetting();
      // this.roles = data['roles'];
      /*data['roles'].forEach((r) => {
        if (
          (r.numberId == 6 ||
            r.numberId == 7 ||
            r.numberId == 8 ||
            r.numberId == 9 ||
            r.numberId == 10) &&
          this.setting.refueling_from_warehouse_production
        ) {
          // console.log(r.numberId);

          tabRoles.push(r);
        } else if (
          r.numberId == 2 ||
          r.numberId == 3 ||
          r.numberId == 4 ||
          r.numberId == 5
        ) {
          tabRoles.push(r);
        }
      });*/
      this.roles = data['roles'];
    });
  }

  closeModal() {
    // this.modalController.dismiss(this.products);
    this.modalController.dismiss();
  }

  isChecked(event, role) {
    console.log(event);
    console.log(role);
    this.modalController.dismiss(role);
  }
}
