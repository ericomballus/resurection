import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FichePointage } from 'src/app/models/fichepointage.model';
import { FichepointageService } from 'src/app/services/fichepointage.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { UrlService } from 'src/app/services/url.service';
import { TranslateConfigService } from 'src/app/translate-config.service';

@Component({
  selector: 'app-fiche-list',
  templateUrl: './fiche-list.page.html',
  styleUrls: ['./fiche-list.page.scss'],
})
export class FicheListPage implements OnInit {
  productsServices: any[] = [];
  storeTypes: string[] = [];
  adminId: any;
  public url;
  randomObj = {};
  firstTime = false;
  ficheList: FichePointage[];
  isOpen = true;
  confirm = false;
  multiStoreList: any[] = [];
  constructor(
    public restApiService: RestApiService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private notification: NotificationService,
    private randomStorage: SaverandomService,
    private ficheService: FichepointageService,
    private urlService: UrlService,
    private location: Location,
    private rangeByStoreService: RangeByStoreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.takeFichePointage();
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      // alert(this.url);
    });
  }
  async takeFichePointage() {
    this.notification.presentLoading();
    this.ficheService.getAllPointageList().subscribe(
      async (resp: any[]) => {
        this.notification.dismissLoading();
        console.log('fiche pointage', resp);
        let tab: FichePointage[] = resp['docs'];
        let arrGroup: any = await this.rangeByStoreService.rangeProductByStore(
          tab
        );
        console.log('group', arrGroup);
        this.multiStoreList = arrGroup;
      },
      (err) => {
        this.notification.dismissLoading();
        console.log(err);
      }
    );
  }
  voir(fiche) {
    console.log(fiche);
    this.ficheService.setFichePointage(fiche);
    this.router.navigateByUrl('fiche-details');
  }
}
