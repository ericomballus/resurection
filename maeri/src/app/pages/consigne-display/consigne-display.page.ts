import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConsigneManagerService } from 'src/app/services/consigne-manager.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-consigne-display',
  templateUrl: './consigne-display.page.html',
  styleUrls: ['./consigne-display.page.scss'],
})
export class ConsigneDisplayPage implements OnInit {
  @Input() Consigne: any;
  totalConsigne = 0; //prix total consigne
  totalCassier = 0;
  totalBtl = 0;
  constructor(
    private modal: ModalController,
    private notifi: NotificationService,
    private consigne: ConsigneManagerService
  ) {}

  ngOnInit() {
    console.log(this.Consigne);
    /*  this.Consigne.forEach((elt) => {
      if (elt['cassier']) {
        this.totalCassier = this.totalCassier + parseInt(elt['cassier']);
      }
      if (elt['bouteille']) {
        this.totalBtl = this.totalBtl + parseInt(elt['bouteille']);
      }
    }); */
  }
  closeModal() {
    this.modal.dismiss();
  }

  update() {
    this.notifi.presentLoading();
    let Fund = true;
    this.Consigne.articles.forEach((con) => {
      if (con.cassier > 0 || con.bouteille > 0) {
        Fund = false;
      }
    });
    if (Fund) {
      this.Consigne['Fund'] = true;
    }
    this.consigne.updateConsigne(this.Consigne).subscribe(
      (res) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('this order update successfully', 'success');
        this.modal.dismiss({ consigne: this.Consigne });
      },
      (err) => {
        this.notifi.dismissLoading();
        this.notifi.presentError('sorry unable to update this order', 'danger');
      }
    );
  }

  getNewValueCassier(ev, row, i) {
    let newVal = parseInt(ev.detail.value);
    if (newVal >= 0) {
      this.Consigne.articles[i]['cassier'] = newVal;
    }
  }
  getNewValueBouteille(ev, row, i) {
    let newVal = parseInt(ev.detail.value);
    if (newVal >= 0) {
      this.Consigne.articles[i]['bouteille'] = newVal;
    }
  }
}
