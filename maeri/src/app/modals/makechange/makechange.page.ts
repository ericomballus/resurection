import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { AdminService } from 'src/app/services/admin.service';
import { Setting } from 'src/app/models/setting.models';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-makechange',
  templateUrl: './makechange.page.html',
  styleUrls: ['./makechange.page.scss'],
})
export class MakechangePage implements OnInit {
  data: any;
  montant = 0;
  nbr = 0;
  constructor(
    private saveRandom: SaverandomService,
    private modal: ModalController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.data = this.saveRandom.getData();
  }
  confirmBtlPleine() {
    this.data['pleine'] = !this.data['pleine'];
    if (this.data['vide']) {
      this.data['vide'] = !this.data['vide'];
    }
  }

  confirmBtlVide() {
    this.data['vide'] = !this.data['vide'];
    if (this.data['pleine']) {
      this.data['pleine'] = !this.data['pleine'];
    }
  }
  validate() {
    this.data['montant'] = this.montant;
    this.data['nbr'] = this.nbr;
    this.saveRandom.setData(this.data);
    this.modal.dismiss();
  }
}
