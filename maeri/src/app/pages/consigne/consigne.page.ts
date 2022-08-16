import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { ConsigneManagerService } from 'src/app/services/consigne-manager.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ConsigneDisplayPage } from '../consigne-display/consigne-display.page';

@Component({
  selector: 'app-consigne',
  templateUrl: './consigne.page.html',
  styleUrls: ['./consigne.page.scss'],
})
export class ConsignePage implements OnInit {
  productsItem: any;
  randomObj = {};
  consigneTab = [];
  constructor(
    public restApiService: RestApiService,
    public adminService: AdminService,
    public resApi: RestApiService,
    public saveRandom: SaverandomService,
    public router: Router,
    public notifi: NotificationService,
    public consigne: ConsigneManagerService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    if (this.saveRandom.checkIfUsePack) {
      this.notifi.presentLoading();
      this.consigne.getAllConsigne().subscribe((res) => {
        this.notifi.dismissLoading();
        res['docs'].forEach((con) => {
          con['customer'] = con['commandes'][0]['customer'];
        });
        this.consigneTab = res['docs'];
      });
    } else {
      this.router.navigateByUrl('start');
      this.notifi.presentError(
        "vousn'avez pas d'accés pour cette page",
        'danger'
      );
    }
  }

  async displayConsigne(row) {
    const modal = await this.modalController.create({
      component: ConsigneDisplayPage,
      componentProps: { Consigne: row },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data['data']);
      if (data['data'] && data['data']['consigne']) {
        /* this.consigneTab.filter((con) => {
          return con._id != data['data']['consigne']['_id'];
        }); */
        this.consigne.getAllConsigne().subscribe((res) => {
          console.log('consigne', res);
          res['docs'].forEach((con) => {
            con['customer'] = con['commandes'][0]['customer'];
          });
          this.consigneTab = res['docs'];
          console.log('consigne', this.consigneTab);
        });
      }
    });
    return await modal.present();
  }

  manageConsigne(row) {
    console.log(row);
  }
}
