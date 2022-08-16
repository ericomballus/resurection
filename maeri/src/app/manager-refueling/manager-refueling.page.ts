import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../services/notification.service';
import { TranslateConfigService } from '../translate-config.service';
import { RefuelingService } from '../services/refueling.service';
import { SaverandomService } from '../services/saverandom.service';
import { RangeByStoreService } from '../services/range-by-store.service';

@Component({
  selector: 'app-manager-refueling',
  templateUrl: './manager-refueling.page.html',
  styleUrls: ['./manager-refueling.page.scss'],
})
export class ManagerRefuelingPage implements OnInit {
  RefuelingList = [];
  isSuperManager = false;
  productListTab: any;
  constructor(
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private notifi: NotificationService,
    private refueling: RefuelingService,
    private saveRandom: SaverandomService,
    private rangeByStoreService: RangeByStoreService
  ) {}

  ngOnInit() {
    this.languageChanged();
    this.getRefueling();
  }
  languageChanged() {
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  getRefueling() {
    if (this.saveRandom.getSuperManager()) {
      this.isSuperManager = true;
      this.refueling.superManagerRefueling().subscribe(async (data: any) => {
        this.productListTab =
          await this.rangeByStoreService.rangeProductByStore(data);
      });
    } else {
      this.refueling.managerGetRefueling().subscribe((data: any) => {
        this.RefuelingList = data;
      });
    }
  }

  confirmRefueling(prod) {
    let a: any = {};
    this.translate.get('MENU.confirmtransaction').subscribe((t) => {
      a['confirm'] = t;
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

    this.notifi
      .presentAlertConfirm(a['confirm'], a['ok'], a['no'])
      .then((res) => {
        this.notifi.presentLoading();
        this.refueling.managerConfirmRefueling(prod).subscribe((res) => {
          this.RefuelingList = this.RefuelingList.filter(
            (elt) => elt._id !== prod._id
          );
          this.notifi.dismissLoading();
        });
      });
  }
}
