import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AgenceCommande } from 'src/app/models/agenceCommande';
import { Setting } from 'src/app/models/setting.models';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { SupercashierService } from 'src/app/services/supercashier.service';
import { TranslateConfigService } from 'src/app/translate-config.service';

@Component({
  selector: 'app-sw-display-commande',
  templateUrl: './sw-display-commande.page.html',
  styleUrls: ['./sw-display-commande.page.scss'],
})
export class SwDisplayCommandePage implements OnInit {
  AgenceCommande: AgenceCommande[] = [];
  originalCommande: any;
  tabRoles = [];
  @ViewChild('header', { static: false }) header: ElementRef;

  display_footer = false;
  display_section = false;
  setting: Setting;
  constructor(
    private random: SaverandomService,
    private notifi: NotificationService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public scService: SupercashierService,
    private location: Location,
    private menu: MenuController
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.setting = this.random.getSetting();
    this.AgenceCommande = this.random.getAgenceCommande();
    this.originalCommande = this.random.getData();
    this.AgenceCommande.forEach((c) => c.request.item.sellingPrice);
    console.log(this.originalCommande);
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
    this.tabRoles = this.random.getTabRole();
  }

  sendToSuperWareouse() {
    let tabRole = this.random.getTabRole();

    if (tabRole.includes(9) && this.originalCommande['saConfirm'] == false) {
      this.notifi.presentToast(
        "impossible de faire cette opération  l'administration doit d'abord l'autorisé",
        'danger'
      );
      return;
    }

    this.notifi.presentLoading();
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

    if (tabRole.includes(7)) {
      this.originalCommande['swConfirm'] = true;
    } else if (tabRole.includes(10)) {
      this.originalCommande['saConfirm'] = true;
    }

    this.originalCommande['managerConfirm'] = false;
    this.originalCommande['delivery'] = false;
    this.notifi
      .presentAlertConfirm('vous confirmez la livraison ?', 'OUI', 'NON')
      .then(() => {
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
      .catch((err) => console.log(err));
  }

  print() {
    this.header.nativeElement.style.display = 'none';
    this.menu.enable(false, 'first');
    this.display_footer = true;
    this.display_section = true;
    setTimeout(() => {
      window.print();
      this.header.nativeElement.style.display = 'block';
      this.menu.enable(true, 'first');
      this.display_footer = false;
      // this.display_section= false;
    }, 150);
    //
  }
}
