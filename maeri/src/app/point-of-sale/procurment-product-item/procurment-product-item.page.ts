import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Socket } from 'ngx-socket-io';
//import { WarehouseService } from "../services/warehouse.service";
import { WarehouseService } from 'src/app/services/warehouse.service';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from 'src/app/translate-config.service';
import io from 'socket.io-client';
import { UrlService } from '../../services/url.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-procurment-product-item',
  templateUrl: './procurment-product-item.page.html',
  styleUrls: ['./procurment-product-item.page.scss'],
})
export class ProcurmentProductItemPage implements OnInit {
  transaction: Array<any> = [];
  adminId: any;
  adminFlag: boolean = false;
  managerFlag: boolean = false;
  cashierFlag: boolean = false;
  wareHouseFlag: boolean = false;
  public sockets;
  public url;
  tabRoles = [];
  vendorRole: Boolean = false;
  userName: any;
  constructor(
    private adminService: AdminService,
    // private socket: Socket,
    public warehouService: WarehouseService,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public urlService: UrlService,
    public restApiService: RestApiService,
    private saveRandom: SaverandomService,
    private notifi: NotificationService
  ) {
    if (
      JSON.parse(localStorage.getItem('user'))[0] &&
      JSON.parse(localStorage.getItem('user'))[0].venderRole
    ) {
      this.vendorRole = JSON.parse(localStorage.getItem('user'))[0].venderRole;
    }
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    this.takeUrl();
    this.takeTransaction();
    this.adminId = localStorage.getItem('adminId');
    this.webServerSocket(this.adminId);

    if (
      this.tabRoles.includes(1) ||
      this.tabRoles.includes(2) ||
      this.tabRoles.includes(3)
    ) {
      this.adminFlag = true;
    }
    if (this.tabRoles.includes(2)) {
      this.managerFlag = true;
    }
    if (this.tabRoles.includes(4)) {
      this.cashierFlag = true;
    }
    this.languageChanged();
  }

  ngOnInit() {}

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

  takeTransaction() {
    let role = 2;
    if (this.tabRoles.includes(2)) {
      role = 2;
    } else {
      role = 0;
    }
    this.adminService
      .getStoreMballusTransaction(this.saveRandom.getStoreId(), role)
      .subscribe((data) => {
        // this.takeProduct();
        console.log(data);

        this.transaction = data['docs'];
      });
  }
  confirmTrasaction(prod, i) {
    console.log(prod);
    this.notifi.presentLoading();
    prod['confirm'] = true;
    let data = {
      id: prod['_id'],
      receiver: JSON.parse(localStorage.getItem('user'))['name'],
      receiverId: JSON.parse(localStorage.getItem('user'))['_id'],
      confirm: true,
    };
    this.adminService.cashierConfirmTransaction(data).subscribe(
      (data) => {
        console.log(data);

        this.notifi.dismissLoading();
        this.transaction = this.transaction.filter((T) => T._id !== prod._id);
      },
      (err) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('impossible de mettre a jour', 'danger');
        prod['confirm'] = false;
      }
    );
    /*  if (prod.productType == 'manufacturedItems') {
      let data = {
        id: prod['_id'],
        quantity: prod['quantityItems'],
        receiver: this.userName,
      };
      this.adminService
        .confirmTransaction(prod._id, this.userName)
        .subscribe((res) => {
          console.log(res);
          prod['confirm'] = true;
          prod['receiver'] = this.userName;
          this.warehouService.updateManufacturedItemStoreConfirm((data) => {
            console.log(data);
          });
        });
      return;
    }
    this.userName = JSON.parse(localStorage.getItem('user'))['name'];
    let data = {
      id: prod['idprod'],
      quantity: prod['quantityItems'],
      receiver: this.userName,
    };

    this.warehouService.updateProductItemStore(data).subscribe((res) => {
      prod['confirm'] = true;
      this.adminService
        .confirmTransaction(prod._id, this.userName)
        .subscribe((data) => {
          this.restApiService.clearProvision();
          console.log(data);
          this.warehouService
            .confirmProductItemStore({ id: prod.idprod })
            .subscribe((data) => {
              console.log(data);
            });
         
        });
    });*/
  }

  webServerSocket(id) {
    // this.socket.connect();

    this.sockets = io(this.url);
    this.sockets.on('connect', function () {
      //console.log("depuis client socket");
    });

    this.sockets.on(`${id}transactionNewItem`, (data) => {
      let tab2 = [];
      let obj = data['data'];
      console.log('new order', data);
      if (data['prod']['prod']) {
        let packSize = data['prod']['prod']['packSize'];
        let nbrcassier = obj['quantityItems'] / packSize;
        let btl = obj['quantityItems'] % packSize;
        obj['cassier'] = parseInt(nbrcassier.toString());
        obj['btls'] = parseInt(btl.toString());
        obj['sizeUnitProduct'] = data['prod']['prod']['sizeUnitProduct'];
        obj['unitNameProduct'] = data['prod']['prod']['unitNameProduct'];
      }
      this.transaction.unshift(obj);
    });

    this.sockets.on(`${id}transactionUpdateItem`, async (data) => {
      console.log('hello', data);

      if (data && data['_id']) {
        let index = await this.transaction.findIndex((elt) => {
          return elt._id === data['_id'];
        });
        if (this.transaction[index]) {
          this.transaction[index]['receiver'] = data['receiver'];
          this.transaction[index]['confirm'] = data['confirm'];
        }

        // this.transaction.splice(index, 1, data);
      }
    });
  }

  takeProduct() {
    let divi;
    let tab = [];
    this.restApiService.getProductItem().subscribe(
      (data: any[]) => {
        //  console.log("products", data);
        this.transaction.forEach((elt) => {
          tab = [];
          tab = data.filter((prod) => {
            // console.log(prod);

            return prod['_id'] == elt['idprod'];
          });
          // console.log(tab);

          if (tab.length && tab[0]['packSize']) {
            divi = elt.quantityItems / tab[0].packSize;
            elt['btls'] = elt.quantityItems % tab[0].packSize;
            elt['cassier'] = parseInt(divi.toString());

            elt['unitNameProduct'] = tab[0]['unitNameProduct'];
            elt['sizeUnitProduct'] = tab[0]['sizeUnitProduct'];
          }

          // let divi2 = elt.quantityStore / elt.packSize;

          // console.log(elt);

          //elt["cassierStore"] = parseInt(divi2.toString());
          // elt["btlsStore"] = elt.quantityStore % elt.packSize;
        });
      },
      (err) => {}
    );
  }

  async cancelProcurement(prod) {
    if (!prod.confirm) {
      try {
        await this.notifi.presentAlertConfirm(
          `annuler le ravitaillement ?`,
          'OUI',
          'NON'
        );
      } catch (error) {}
    }
  }
}
