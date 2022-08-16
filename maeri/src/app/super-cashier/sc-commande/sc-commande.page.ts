import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgenceCommande } from 'src/app/models/agenceCommande';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { SupercashierService } from 'src/app/services/supercashier.service';
import { TranslateConfigService } from 'src/app/translate-config.service';

@Component({
  selector: 'app-sc-commande',
  templateUrl: './sc-commande.page.html',
  styleUrls: ['./sc-commande.page.scss'],
})
export class ScCommandePage implements OnInit {
  AgenceCommande: any[] = [];
  originalCommande: any;
  constructor(
    private random: SaverandomService,
    private notifi: NotificationService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public scService: SupercashierService,
    private location: Location
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.AgenceCommande = this.random.getAgenceCommande();
    this.originalCommande = this.random.getData();
    console.log(this.originalCommande);
    // *ngIf="!originalCommande.scConfirm"
    this.AgenceCommande.forEach((c) => c.request.item.sellingPrice);
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  addValue(ev, i) {
    console.log(ev.detail.value);
    console.log(i);
    let value = parseInt(ev.target['value']);
    if (
      value &&
      value > 0 &&
      value <= this.AgenceCommande[i].avaible.quantityItems
    ) {
      this.AgenceCommande[i].avaible.quantityItems =
        this.AgenceCommande[i].avaible.quantityItems - value;
      this.AgenceCommande[i].accept = value;
      this.AgenceCommande[i].reject =
        this.AgenceCommande[i].request.qty - value;
    } else if (
      value &&
      value > 0 &&
      value > this.AgenceCommande[i].avaible.quantityItems
    ) {
      this.notifi.presentToast(
        'la qauntité a livrer est supérieur a la quantité disponible',
        'danger'
      );
    } else {
      this.AgenceCommande[i].avaible.quantityItems =
        this.AgenceCommande[i].avaible.quantityItems +
        this.AgenceCommande[i].accept;
      this.AgenceCommande[i].accept = 0;
      this.AgenceCommande[i].reject = 0;
    }
  }

  sendToSuperWareouse() {
    let a: any = {};
    this.translate.get('MENU.confirmInvoice').subscribe((t) => {
      a['confirmInvoice'] = t;
    });
    this.translate.get('MENU.cancel').subscribe((t) => {
      a['cancel'] = t;
    });
    this.translate.get('MENU.ok').subscribe((t) => {
      a['ok'] = t;
    });
    this.translate.get('MENU.no').subscribe((t) => {
      a['no'] = t;
    });
    /* this.originalCommande['AgenceCommande'] = this.AgenceCommande.forEach(
      (elt) => elt.request.item.name
    );*/
    this.originalCommande['AgenceCommande'] = this.AgenceCommande;
    this.originalCommande['scConfirm'] = true;
    this.originalCommande['swConfirm'] = false;
    this.originalCommande['managerConfirm'] = false;
    this.originalCommande['delivery'] = false;
    this.scService.updatePurchase(this.originalCommande).subscribe(
      (res) => {
        console.log(res);
        this.notifi.dismissLoading();
        this.notifi.presentToast(
          'la commande enregistré avaec succéss',
          'success'
        );
        this.location.back();
      },
      (err) => {
        this.notifi.presentToast(
          'une erreur est survenue impossible de continuer cette opération',
          'danger'
        );
        console.log(err);
      }
    );
  }

  cancelAndUpdate() {
    this.notifi
      .presentAlertConfirm('Annuler les changements?', 'OUI', 'NON')
      .then(() => {
        this.notifi.presentLoading();
        this.originalCommande['scConfirm'] = false;
        this.originalCommande['swConfirm'] = false;
        this.originalCommande['managerConfirm'] = false;
        this.originalCommande['delivery'] = false;
        this.originalCommande['restore'] = true;

        this.scService.updatePurchase(this.originalCommande).subscribe(
          (res) => {
            console.log(res);
            this.notifi.dismissLoading();
            this.notifi.presentToast(
              'la commande enregistré avaec succéss',
              'success'
            );
            this.location.back();
          },
          (err) => {
            this.notifi.presentToast(
              'une erreur est survenue impossible de continuer cette opération',
              'danger'
            );
            console.log(err);
          }
        );
      })
      .catch(() => {});
  }
}
