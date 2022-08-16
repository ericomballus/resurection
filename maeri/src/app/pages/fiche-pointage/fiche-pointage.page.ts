import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FichePointage } from 'src/app/models/fichepointage.model';
import { FichepointageService } from 'src/app/services/fichepointage.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ServiceListService } from 'src/app/services/service-list.service';
import { UrlService } from 'src/app/services/url.service';
import { TranslateConfigService } from 'src/app/translate-config.service';

@Component({
  selector: 'app-fiche-pointage',
  templateUrl: './fiche-pointage.page.html',
  styleUrls: ['./fiche-pointage.page.scss'],
})
export class FichePointagePage implements OnInit {
  productsServices: any[] = [];
  storeTypes: string[] = [];
  adminId: any;
  public url;
  randomObj = {};
  firstTime = false;
  fiche: FichePointage;
  isOpen = true;
  confirm = false;
  lastFiche: FichePointage[] = [];
  constructor(
    public restApiService: RestApiService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    private notification: NotificationService,
    private randomStorage: SaverandomService,
    private ficheService: FichepointageService,
    private urlService: UrlService,
    private location: Location,
    private servicelistService: ServiceListService
  ) {}

  ngOnInit() {
    let setting = this.randomStorage.getSetting();
    this.storeTypes = this.randomStorage.getAdminAccount().storeType;
    if (this.storeTypes.length == 1 && this.storeTypes.includes('services')) {
      // this.btnService = true;
    }
    this.takeFichePointage();
    if (this.storeTypes.includes('services')) {
    }
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      this.adminId = localStorage.getItem('adminId');
      // alert(this.url);
    });
  }
  takeFichePointage() {
    this.notification.presentLoading();
    this.ficheService.getPointageList().subscribe(
      (docs: FichePointage[]) => {
        let storeId = this.randomStorage.getStoreId();

        if (docs.length) {
          docs = docs.filter((fiche) => fiche.storeId == storeId);
        }
        this.notification.dismissLoading();
        console.log('fiche pointage', docs);
        if (!docs.length) {
          this.notification
            .presentAlertConfirm(
              'aucune fiche de pointage ouverte créer une nouvelle fiche a partir des stocks actuelles ?',
              'Oui',
              'Non'
            )
            .then((resp) => {
              this.firstTime = true;
              this.notification.presentLoading();

              this.takeLastFiche();
            })
            .catch((err) => {});
        } else {
          this.fiche = docs[0];
          this.productsServices = docs[0].list;
        }
      },
      (err) => {
        this.notification.dismissLoading();
        console.log(err);
      }
    );
  }

  takeLastFiche() {
    this.ficheService.getLastFiche().subscribe((data: FichePointage[]) => {
      console.log('la dernier fiche ici==>', data);
      if (data.length == 0) {
        this.takeProductServiceList();
      } else {
        //  this.productsServices = docs[0].list;
        data[0].list.forEach((elt) => {
          elt.quantityStore = elt.stockFinale;
          elt.pointage = 0;
          elt.ventes = 0;
          elt.pointageList = [];
          elt.stockFinale = 0;
          elt.stockFinaleList = [];
        });
        this.productsServices = data[0].list;
        this.notification.dismissLoading();
      }
    });
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }
  takeProductServiceList() {
    let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
    this.restApiService.getBillardList().subscribe(
      async (data) => {
        //let a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
        let a = data['product'];
        if (this.randomStorage.getSuperManager()) {
          a = data['product'].sort((c, b) => (c.name > b.name ? 1 : -1));
        } else {
          a = data['product'].filter((elt) => elt.storeId === storeId);
        }

        this.productsServices = a;
        this.sortProductItem();
      },
      (err) => {
        console.log(err);
        this.notification.dismissLoading();
      }
    );
  }
  sortProductItem() {
    if (this.productsServices.length) {
    }
    this.productsServices = this.productsServices.sort((b, c) => {
      if (b.name.toLocaleLowerCase() > c.name.toLocaleLowerCase()) {
        return 1;
      }
      if (b.name.toLocaleLowerCase() < c.name.toLocaleLowerCase()) {
        return -1;
      }
      return 0;
    });
    this.notification.dismissLoading();
  }
  updateFiche() {
    this.notification.presentLoading();
    this.fiche.list = this.productsServices;
    this.ficheService.updateFichePointage(this.fiche).subscribe(
      (data) => {
        let arr = this.generateArray(this.randomObj);
        arr.forEach((elt) => {
          let product = {
            id: elt.prod._id,
            quantity: elt.incommingValue,
            sender: JSON.parse(localStorage.getItem('user'))['name'],
            senderId: JSON.parse(localStorage.getItem('user'))['_id'],
            productType: elt.prod.productType,
          };
          this.updateServiceListStore(product);
        });
        this.notification.dismissLoading();
        this.notification.presentToast('la fiche a été mise a jour', 'primary');
        this.location.back();
      },
      (err) => {
        console.log(err);

        this.notification.dismissLoading();
        this.notification.presentToast('impossible de mettre a jour', 'danger');
      }
    );
  }
  saveFiche() {
    this.notification
      .presentAlertConfirm(
        'voulez vous cloturer la fiche de pointage ?',
        'Oui',
        'Non'
      )
      .then((res) => {
        this.notification.presentLoading();
        setTimeout(() => {
          this.notification.dismissLoading();
          this.notification
            .presentAlertConfirm(
              'veillez entrer le stock finale pour chacuns des produits ?',
              'OK'
            )
            .then(() => {
              this.isOpen = false;
              this.confirm = true;
            });
        }, 1500);
      })
      .catch((err) => {});
  }
  closeFiche() {
    let tab = [];
    console.log(this.fiche);
    console.log(this.productsServices);
    this.notification.presentLoading();
    this.productsServices.forEach((prod) => {
      let exist = 'stockFinale' in prod;
      if (!exist) {
        tab.push(prod);
      }
    });
    if (tab.length) {
      let phrase = `veillez entrer le stock finale pour les produits:`;
      tab.forEach((prod) => {
        phrase = phrase + '-' + prod.name + '\n';
      });
      this.notification.dismissLoading();
      this.notification.presentAlertConfirm(phrase, 'Ok').then(() => {});
    } else {
      this.fiche.list = this.productsServices;
      this.fiche.open = false;
      this.ficheService.updateFichePointage(this.fiche).subscribe(
        (data) => {
          this.notification.dismissLoading();
          this.notification.presentToast(
            'la fiche a été enregistré',
            'success'
          );
          this.location.back();
        },
        (err) => {
          this.notification.dismissLoading();
          this.notification.presentToast(
            'impossible de mettre a jour',
            'danger'
          );
        }
      );
    }
  }
  createFiche() {
    this.notification
      .presentAlertConfirm(
        'créer une nouvelle fiche de pointage ?',
        'Oui',
        'Non'
      )
      .then(() => {
        this.notification.presentLoading();
        this.ficheService
          .postPointage(this.productsServices)
          .subscribe((result) => {
            if (this.randomObj) {
              let arr = this.generateArray(this.randomObj);
              arr.forEach((elt) => {
                let product = {
                  id: elt.prod._id,
                  quantity: elt.incommingValue,
                  sender: JSON.parse(localStorage.getItem('user'))['name'],
                  senderId: JSON.parse(localStorage.getItem('user'))['_id'],
                  productType: elt.prod.productType,
                };
                this.updateServiceListStore(product);
              });
            }

            this.notification.dismissLoading();
            this.firstTime = false;
            this.notification.presentToast(
              'Nouvelle fiche de pointage crée !',
              'primary'
            );
            console.log(result);
          });
        //  console.log(this.productsServices);
      })
      .catch((err) => {
        console.log(err);
        this.notification.dismissLoading();
      });
  }

  addIncrementProductService(ev, prod, i) {
    let value = parseInt(ev.target['value']);
    if (Number.isNaN(value)) {
      let id = prod['_id'];
      delete this.randomObj[id];
      let a = Object.keys(this.randomObj);
      if (prod['pointageList']) {
        let lastEntry = prod['pointageList'][prod['pointageList'].length - 1];
        prod['pointage'] = prod['pointage'] - lastEntry.qty;
        prod['pointageList'].pop();
      }
    } else {
      let id = prod['_id'];
      let nbr = value;
      let obj = { date: Date.now(), qty: nbr };
      let storedItem = this.randomObj[id];
      if (prod['pointageList']) {
        prod['pointageList'].push(obj);
      } else {
        prod['pointageList'] = [];
        prod['pointageList'].push(obj);
      }
      prod['pointage'] = 0;
      prod['pointageList'].forEach((elt) => {
        if (prod['pointage']) {
          prod['pointage'] = prod['pointage'] + elt.qty;
        } else {
          prod['pointage'] = elt.qty;
        }
      });
      if (!storedItem) {
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr,
          prod: prod,
        };
      } else {
        let oldValue = this.randomObj[id]['incommingValue'];
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          incommingValue: nbr + oldValue,
          prod: prod,
        };
      }

      let arr = this.generateArray(this.randomObj);
    }
  }

  getStockFinale(ev, prod, i) {
    let value = parseInt(ev.target['value']);
    if (Number.isNaN(value)) {
      let id = prod['_id'];
      delete this.randomObj[id];
      let a = Object.keys(this.randomObj);
      if (prod['stockFinaleList'] && prod['stockFinaleList'].length) {
        let lastEntry =
          prod['stockFinaleList'][prod['stockFinaleList'].length - 1];
        prod['stockFinale'] = prod['stockFinale'] - lastEntry.qty;
        prod['stockFinaleList'].pop();
      }
      console.log(prod);
    } else {
      let id = prod['_id'];
      let nbr = value;
      let obj = { date: Date.now(), qty: nbr };
      let storedItem = this.randomObj[id];
      if (prod['stockFinaleList'] && prod['stockFinaleList'].length) {
        prod['stockFinaleList'].push(obj);
      } else {
        prod['stockFinaleList'] = [];
        prod['stockFinaleList'].push(obj);
      }
      prod['stockFinale'] = 0;
      prod['stockFinaleList'].forEach((elt) => {
        if (prod['stockFinale']) {
          prod['stockFinale'] = prod['stockFinale'] + elt.qty;
        } else {
          prod['stockFinale'] = elt.qty;
        }
      });

      prod['ventes'] =
        prod['quantityStore'] + prod['pointage'] - prod['stockFinale'];
      if (!storedItem) {
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          finaleValue: nbr,
          prod: prod,
        };
      } else {
        let oldValue = this.randomObj[id]['finaleValue'];
        this.randomObj[id] = {
          // maeriValue: prod["quantityItems"] + prod["quantityStore"],
          finaleValue: nbr + oldValue,
          prod: prod,
        };
      }

      let arr = this.generateArray(this.randomObj);
    }
  }
  generateArray(randomObj) {
    const arr = [];
    for (var id in randomObj) {
      arr.push(randomObj[id]);
    }
    return arr;
  }

  updateServiceListStore(prod) {
    this.servicelistService.updateServiceStore(prod).subscribe((resp) => {
      // this.takeProductServiceList();
    });
  }
}
