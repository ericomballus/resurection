import { Component, OnInit } from '@angular/core';
import io from 'socket.io-client';
import { UrlService } from '../../services/url.service';
import { Socket } from 'ngx-socket-io';
import { RestApiService } from '../../services/rest-api.service';
import {
  AlertController,
  ModalController,
  ActionSheetController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Router } from '@angular/router';
import { TranslateConfigService } from '../../translate-config.service';
import { TranslateService } from '@ngx-translate/core';
import { AdminService } from 'src/app/services/admin.service';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-manageitems',
  templateUrl: './manageitems.page.html',
  styleUrls: ['./manageitems.page.scss'],
})
export class ManageitemsPage implements OnInit {
  productsItem: any;
  productResto: any;
  adminId: any;
  public sockets;
  public url;
  stock_min: Number;
  checkPack = false;
  constructor(
    public restApiService: RestApiService,
    public alertController: AlertController,
    public toastController: ToastController,
    public adminService: AdminService,
    // public loadingController: LoadingController,
    private socket: Socket,
    private router: Router,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public urlService: UrlService,
    public warehouseService: WarehouseService,
    private saveRadom: SaverandomService,
    private notification: NotificationService
  ) {}

  ngOnInit() {
    let setting = JSON.parse(localStorage.getItem('setting'));
    if (Array.isArray(setting)) {
      console.log('is array here');
      if (setting[0]['SaleInPack']) {
        this.checkPack = true;
        localStorage.setItem('saleAsPack', 'true');
      } else {
        this.checkPack = false;
      }
    } else {
      console.log('not arra');
      if (setting['SaleInPack']) {
        this.checkPack = true;
        localStorage.setItem('saleAsPack', 'true');
      } else {
        this.checkPack = false;
      }
    }
    if (this.checkPack) {
      this.notification.presentToast(
        'you are using a mode that does not allow you to open this page',
        'danger'
      );
      this.router.navigateByUrl('/point-of-sale');
    } else {
      this.getSetting();
      this.takeUrl();
      this.adminId = localStorage.getItem('adminId');
      this.webServerSocket(this.adminId);
      setTimeout(() => {
        this.takeProductItems();
      }, 1000);
    }
  }
  takeUrl() {
    this.urlService.getUrl().subscribe((data) => {
      this.url = data;
      // alert(this.url);
    });
  }

  languageChanged() {
    console.log('lang shop page');
    let lang = localStorage.getItem('language');
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  takeProductItems() {
    this.restApiService.getProductItem().subscribe((data: any[]) => {
      let storeId = JSON.parse(localStorage.getItem('user'))['storeId'];
      console.log(data);

      this.productsItem = data.filter((prod) => {
        return prod['storeId'] == storeId;
      });
    });
  }

  webServerSocket(id) {
    //this.socket.connect();

    //  this.socket.emit("set-name", name);
    this.sockets = io(this.url);
    this.sockets.on('connect', function () {
      //console.log("depuis client socket");
    });

    this.sockets.on(`${id}productItemGlace`, async (data) => {
      console.log(data);

      if (data && data['_id']) {
        let index = await this.productsItem.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        // this.productsItem.splice(index, 1, data);
        console.log(this.productsItem[index]);

        let urlp = this.productsItem[index]['url'];
        this.productsItem.splice(index, 1, data);
        this.productsItem[index]['url'] = urlp;
      }
    });
  }

  getSetting() {
    this.adminService.getCompanySetting().subscribe((data) => {
      console.log(data);
      if (data['company'].length) {
        this.stock_min = data['company'][0]['stock_min'];
      }
    });
  }

  async updateStore(prod) {
    let a: any = {};
    console.log(prod);

    this.translate.get('add').subscribe((t) => {
      console.log('hello translate');
      console.log(t);

      a.title = t;
    });
    this.translate.get('cancel').subscribe((t) => {
      a.cancel = t;
    });
    this.translate.get('placeholder').subscribe((t) => {
      a.placeholder = t;
    });

    const alert = await this.alertController.create({
      header: `Available ${prod.quantityStore - prod.glace}`,
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'quantity',
        },
      ],
      buttons: [
        {
          text: a.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: a.title,
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(data);
            console.log(prod);

            if (prod['glace']) {
              //me donne le nombre de non glacé
              if (
                prod.quantityStore -
                  parseInt(prod['glace']) -
                  parseInt(data['quantity']) <
                0
              ) {
                this.presentAlert();
              } else {
                this.warehouseService
                  .updateIce({
                    id: prod._id,
                    quantity: parseInt(data['quantity']),
                    prod: prod,
                  })
                  .subscribe(
                    (data) => {
                      console.log(data);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
            } else {
              if (prod.quantityStore - parseInt(data['quantity']) < 0) {
                this.presentAlert();
              } else {
                this.warehouseService
                  .updateIce({
                    id: prod._id,
                    quantity: parseInt(data['quantity']),
                    prod: prod,
                  })
                  .subscribe(
                    (data) => {
                      console.log(data);
                    },
                    (err) => {
                      console.log(err);
                    }
                  );
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'ALERT',
      // subHeader: ` ${data}`,
      //message: data.data.message,
      message: 'NOT ENOUGTH IN STOCK.',
      cssClass: 'AlertStock',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
