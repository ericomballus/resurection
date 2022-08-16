import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';
//import { Events } from "@ionic/angular";

import {
  ToastController,
  NavController,
  IonSlides,
  AlertController,
} from '@ionic/angular';
import { BehaviorSubject, interval } from 'rxjs';

import { UrlService } from '../services/url.service';
import { ScreensizeService } from '../services/screensize.service';
import { MyeventsService } from '../services/myevents.service';
import { MenuController } from '@ionic/angular';
//import { CacheService } from 'ionic-cache';
import { NotificationService } from '../services/notification.service';
import { CachingService } from '../services/caching.service';
import { SaverandomService } from '../services/saverandom.service';
import { AdminService } from '../services/admin.service';
import { ElectronService } from '../services/electron.service';
declare var ARP: any;
export interface User {
  roles: string[];
}
const STORAGE_REQ_KEY = 'storedreq';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('mySlider', { static: true }) slides: IonSlides;
  admin: boolean;
  employee = true;
  adminemail: any;
  userEmail: any;
  userNumber: any;
  currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  maeriAdmin: boolean = false;
  isDesktop: boolean;
  desktop: boolean = true;
  objRandom = {};
  form = {};
  //loadMaeri: any;
  tabRoles: any[];
  constructor(
    public events: MyeventsService,
    private authService: AuthServiceService,
    private router: Router,
    public toastController: ToastController,
    public navCtrl: NavController,
    public alertController: AlertController,
    private screensizeService: ScreensizeService,
    private menu: MenuController,
    private cache: CachingService,
    private notif: NotificationService,
    private urlService: UrlService,
    private saveRandom: SaverandomService,
    private adminService: AdminService //
  ) {
    this.screenCheck();

    let telephone = localStorage.getItem('telephone');

    if (telephone) {
      this.userNumber = telephone;
    }
  }
  ionViewWillEnter() {
    this.menu.enable(false, 'first');
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));

    if (this.tabRoles && this.tabRoles.length && this.tabRoles.includes(5)) {
      this.urlService.getUrl().subscribe((data) => {
        console.log('mballus url here ', data);
      });
      // this.urlService.restoreUrl();
    }
  }
  async login(form) {
    this.connectAdmin(form);
  }

  screenCheck() {
    this.screensizeService.isDesktopView().subscribe((isDesktop) => {
      if (this.isDesktop && !isDesktop) {
        // Reload because our routing is out of place
        //  window.location.reload();
      }

      this.isDesktop = isDesktop;
    });
  }

  goRegisterPage() {
    this.navCtrl.navigateForward('register');
  }

  async goTo(msg) {
    const alert = await this.alertController.create({
      //header: "MAERI",
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'alertButtonNO',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'YES',
          cssClass: 'alertButton',
          handler: () => {
            console.log('Confirm Okay');
            this.navCtrl.navigateForward('point-of-sale');
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(msg) {
    const alert = await this.alertController.create({
      //header: "MAERI",
      message: msg,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'alertButtonNO',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
      ],
    });

    await alert.present();
  }

  async connectAdmin(form) {
    let dev = form.value.password;
    this.notif.presentLoading();
    this.form = form.value;
    /* if (dev.split("@devmaeri") && dev.split("@devmaeri").length > 1) {
      localStorage.setItem("mode", "test");
      form.value.password = dev.split("@devmaeri")[0];
      this.urlService.setTestServer();
      // alert(dev.split("@devmaeri")[0]);
    } else {
      localStorage.removeItem("mode");
    } */
    let lang = localStorage.getItem('language');
    // ;
    localStorage.setItem('language', lang);
    // let credential = JSON.parse(localStorage.getItem('credential'));
    let credential = await this.cache.getCachedRequest('credentialUser');
    localStorage.removeItem('adminMaeri');
    this.authService.login(form.value).subscribe(
      (res) => {
        let lang = localStorage.getItem('language');
        let ip = localStorage.getItem('localIp');
        //  localStorage.setItem('language', lang);

        if (ip) {
          //  localStorage.setItem('localIp', ip);
        }
        // localStorage.setItem('language', lang);
        if (res['user'][0]['role'] === 'adminmaeri') {
          //check if is maeri Admin user
          localStorage.setItem('adminId', res['user'][0]['_id']);
          localStorage.setItem('adminMaeri', JSON.stringify(res));
          if (res['user'][0]['email']) {
            let a = res['user'][0]['email'].split('@');
            let b = a[1].split('.');
            let c = b[0] + b[1];
            localStorage.setItem('adminemail', a[0] + c);
          }

          localStorage.setItem('email', res['user'][0]['email']);
          this.notif.dismissLoading();
          this.router.navigateByUrl('admin-page');
          return;
        } else {
          //if is not maeri Admin user but admin customer
          this.cache.clearCachedData().then((res) => {
            console.log(res);
          });
          this.connectAdminEmployee(form.value, res);

          localStorage.setItem('adminId', res['user'][0]['_id']);
        }
      },
      (err) => {
        //if is employee account

        this.connectEmployee(form.value);
      }
    );

    /*  if (
      credential &&
      credential['telephone'] == form.value['telephone'] &&
      credential['password'] == form.value['password'] &&
      this.networkService.getCurrentNetworkStatus() ==
        ConnectionStatus.Offline
     
    ) {
      let account = JSON.parse(localStorage.getItem('credentialAccount'));
      let res = JSON.parse(localStorage.getItem('credentialUser'));
      this.notif
        .dismissLoading()
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
      this.dirigeUser(account, res);
    } else {
      
    } */
  }

  async connectEmployee(localData) {
    this.authService.loginEmploye(localData).subscribe(
      async (res) => {
        localStorage.removeItem('credentialAccount');
        let lang = localStorage.getItem('language');
        let ip = localStorage.getItem('localIp');
        // ;
        //  localStorage.setItem('language', lang);
        if (ip) {
          //  localStorage.setItem('localIp', ip);
        }
        localStorage.setItem('credential', JSON.stringify(localData));
        localStorage.setItem('credentialUser', JSON.stringify(res));
        localStorage.setItem('adminId', res['user'][0]['adminId']);

        this.authService.getAdminAccount(res['user'][0]['adminId']).subscribe(
          (account) => {
            this.notif
              .dismissLoading()
              .then((data) => console.log(data))
              .catch((err) => console.log(err));
            if (account['users'][0]['autorization']) {
              localStorage.setItem(
                'credentialAccount',
                JSON.stringify(account)
              );

              this.dirigeUser(account, res);
              this.cache.cacheRequest('credentialUser', this.form);
            } else {
              this.presentAlert('Please contact Maeri Team');
            }
          },
          (err) => {
            // adminUser
            console.log(err);
          }
        );
      },
      async (err) => {
        this.notif
          .dismissLoading()
          .then((data) => console.log(data))
          .catch((err) => console.log(err));
        let credential = await this.cache.getCachedRequest('credentialUser');
        if (
          credential &&
          credential['telephone'] == this.form['telephone'] &&
          credential['password'] == this.form['password']
        ) {
          let account = JSON.parse(localStorage.getItem('credentialAccount'));
          let res = { user: [JSON.parse(localStorage.getItem('user'))] };
          this.notif
            .dismissLoading()
            .then((data) => console.log(data))
            .catch((err) => console.log(err));
          this.dirigeUser(account, res);
          this.notif.presentToast('Offline connection mode app', 'dark');
        } else {
          this.presentAlert('Auth failed! incorrect password');
        }
      }
    );
  }

  dirigeUser(account, res) {
    localStorage.removeItem('MyProductItems');
    localStorage.removeItem('productsResto');
    localStorage.removeItem('serviceProductList');
    localStorage.removeItem('productsListShop');
    this.cache.cacheRequest('credentialUser', this.form);
    if (account['users'][0]['autorization']) {
      // this.currentUser.next({ roles: roles });
      const tabrole = res['user'][0]['role'];
      if (tabrole.length) {
        if (tabrole.length > 1) {
          this.manageRole(tabrole, res, account);
        } else {
          let roles = res['user'][0]['role'].map((elt) => {
            return elt.numberId;
          });
          localStorage.setItem(
            'adminUser',
            JSON.stringify(account['users'][0])
          );
          // console.log(roles);
          this.events.publishRole(roles);
          let database = res['user'][0]['adminEmail'];

          localStorage.setItem('adminId', res['user'][0]['adminId']);
          localStorage.setItem('telephone', res['user'][0]['telephone']);
          localStorage.setItem('adminemail', database);
          localStorage.setItem('user', JSON.stringify(res['user'][0]));
          localStorage.setItem('roles', JSON.stringify(roles));
          localStorage.setItem(
            'display',
            JSON.stringify(account['users'][0]['storeType'])
          );
          this.getSetting();
          roles.forEach((role) => {
            if (roles[0] === 4) {
              this.desktop = false;
              this.router.navigateByUrl('point-of-sale');
              //this.router.navigateByUrl("admin-page");
              localStorage.setItem('route', 'point-of-sale');
              return;
            } else if (roles[0] === 2) {
              this.router
                .navigateByUrl('start')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'start');
              return;
            } else if (roles[0] === 6) {
              this.router
                .navigateByUrl('super-manager')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'super-manager');
              return;
            } else if (roles[0] === 7) {
              this.router
                .navigateByUrl('sw-home')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'sw-home');
              return;
            } else if (roles[0] === 3) {
              this.router.navigateByUrl('warehouse');
              localStorage.setItem('route', 'warehouse');
              return;
            } else if (roles[0] === 5) {
              this.router.navigateByUrl('shop');
              localStorage.setItem('route', 'shop');
              return;
            } else if (roles[0] === 8) {
              this.router
                .navigateByUrl('sc-home')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'sc-home');
              return;
            } else if (roles[0] === 9) {
              this.router
                .navigateByUrl('fc-home')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'fc-home');
              return;
            } else if (roles[0] === 10) {
              this.router
                .navigateByUrl('sa-home')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'sa-home');
              return;
            } else if (roles[0] === 11) {
              this.router
                .navigateByUrl('hospital-home')
                .then((res) => console.log(res))
                .catch((err) => console.log(err));

              localStorage.setItem('route', 'hospital-home');
              return;
            }
          });
        }

        /*
         */
      }
    } else {
      this.presentAlert('Please contact Maeri Team');
    }
  }

  clearStorage() {
    // ;
    let orders = JSON.parse(localStorage.getItem(`lesCommandes`));
    if (orders && orders.length) {
      let tab = [];
      orders = tab;
      localStorage.setItem(`lesCommandes`, JSON.stringify(orders));
    } else {
    }
    let locaData = JSON.parse(localStorage.getItem(`userCommande`));
    if (locaData && locaData.length) {
      let tab = [];
      locaData = tab;
      localStorage.setItem(`userCommande`, JSON.stringify(orders));
    } else {
    }
  }

  getAdminAccount(id) {
    this.authService.getAdminAccount(id).subscribe(
      (account) => {
        if (account['users'][0]['autorization']) {
          localStorage.setItem('credentialAccount', JSON.stringify(account));
        } else {
          this.presentAlert('Please contact Maeri Team');
        }
      },
      (err) => {
        // adminUser
        console.log(err);
      }
    );
  }

  connectAdminEmployee(data, res) {
    res['user'][0]['adminId'];
    if (res['user'][0]['autorization']) {
      this.authService.loginEmploye(data).subscribe(
        (rese) => {
          localStorage.removeItem('credentialUser');
          localStorage.removeItem('credentialAccount');
          this.authService
            .getAdminAccount(res['user'][0]['_id'])
            .subscribe((account) => {
              this.notif.dismissLoading();
              // .then((data) => {})
              //.catch((err) => console.log(err));
              if (account['users'][0]['autorization']) {
                localStorage.setItem(
                  'credentialAccount',
                  JSON.stringify(account)
                );
                this.chooseAccount(res, rese);
                this.cache.cacheRequest('credentialUser', this.form);
              } else {
                this.presentAlert('Please contact Maeri Team');
              }
            });
        },
        async (err) => {
          this.notif
            .dismissLoading()
            .then((data) => {})
            .catch((err) => console.log(err));

          this.getSetting()
            .then((setting) => {
              if (res['user'][0]['email']) {
                let a = res['user'][0]['email'].split('@');
                let b = a[1].split('.');
                let c = b[0] + b[1];
                localStorage.setItem('adminemail', a[0] + c);
              }
              this.events.publishDisplayType(res['user'][0]['storeType']);
              this.events.publishRole([1]);
              if (res['user'][0]['displayType'] === 'list') {
                this.events.publishDisplayType('list');
              }
              localStorage.setItem('roles', JSON.stringify([1]));

              localStorage.setItem('user', JSON.stringify(res['user']));
              localStorage.setItem('email', res['user'][0]['email']);
              localStorage.setItem('telephone', res['user'][0]['telephone']);
              localStorage.setItem('route', 'start');
              this.router.navigateByUrl('start');
              if (res['user'][0]['venderRole']) {
                this.router.navigateByUrl('vendor-start');
              } else {
                this.router.navigateByUrl('start');
              }
            })
            .catch((error) => {
              console.log('errorr===>', error);
              this.router.navigateByUrl('start');
              if (res['user'][0]['venderRole']) {
                // this.router.navigateByUrl("start");
                this.router.navigateByUrl('vendor-start');
              } else {
                this.router.navigateByUrl('start');
              }
            });
        }
      );
    } else {
      this.presentAlert('Please contact Maeri Team For Your Access');
    }
  }
  getUserSubject() {
    return this.currentUser.asObservable();
  }

  logOut() {
    this.currentUser.next(null);
  }

  hasRoles(roles: string[]): boolean {
    for (const oneRole of roles) {
      if (
        !this.currentUser ||
        !this.currentUser.value.roles.includes(oneRole)
      ) {
        return false;
      }
    }
    return true;
  }

  async chooseAccount(firstRes, secondRes) {
    const alert = await this.alertController.create({
      header: 'Choose account',
      buttons: [
        {
          text: 'Admin',
          cssClass: 'my-alert',
          handler: () => {
            console.log('Confirm first');
            if (firstRes['user'][0]['email']) {
              let a = firstRes['user'][0]['email'].split('@');
              let b = a[1].split('.');
              let c = b[0] + b[1];
              localStorage.setItem('adminemail', a[0] + c);
            }

            this.events.publishRole([1]);
            localStorage.setItem('roles', JSON.stringify([1]));

            localStorage.setItem('user', JSON.stringify(firstRes['user']));
            localStorage.setItem('email', firstRes['user'][0]['email']);
            localStorage.setItem('telephone', firstRes['user'][0]['telephone']);
            this.router.navigateByUrl('start');
          },
        },
        {
          text: 'Manager',
          cssClass: 'my-alertconfirm',
          handler: () => {
            // console.log("Confirm Ok");
            let roles = secondRes['user'][0]['role'].map((elt) => {
              return elt.numberId;
            });

            // console.log(roles);
            this.events.publishRole(roles);
            // this.currentUser.next({ roles: roles });
            const tabrole = secondRes['user'][0]['role'];
            if (tabrole.length) {
              // a = res["adminEmail"].split("@");
              //let b = a[1].split(".");
              // let database = a[0] + b[0] + b[1]; /*nom de la base de donnée*/
              let database =
                secondRes['user'][0]['adminEmail']; /*nom de la base de donnée*/
              localStorage.setItem('adminId', secondRes['user'][0]['adminId']);
              localStorage.setItem(
                'telephone',
                secondRes['user'][0]['telephone']
              );
              localStorage.setItem('adminemail', database);
              localStorage.setItem(
                'user',
                JSON.stringify(secondRes['user'][0])
              );
              localStorage.setItem('roles', JSON.stringify(roles));
              this.router.navigateByUrl('start');
            }
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'my-alertcancel',
          handler: () => {
            console.log('Cancel');
          },
        },
      ],
    });

    await alert.present();
  }

  handleInput(ev) {
    console.log(ev.target.value);

    const val = ev.target.value;
    if (val === 'maeri2019') {
      this.maeriAdmin = true;
    } else {
      this.maeriAdmin = false;
    }
  }
  openSetting(setting: string) {}

  async manageRole(tabRole, resultat, account) {
    localStorage.setItem('adminUser', JSON.stringify(account['users'][0]));
    let tabButtons = [];

    tabRole.forEach((role) => {
      let id = role._id;
      if (!this.objRandom[id]) {
        this.objRandom[id] = role;
      }
    });

    const arr = [];
    for (var id in this.objRandom) {
      arr.push(this.objRandom[id]);
    }

    arr.forEach((roles) => {
      let result = resultat;

      let numberId = roles['numberId'];
      let handle = () => {
        this.events.publishRole(roles['numberId']);
        let database =
          result['user'][0]['adminEmail']; /*nom de la base de donnée*/
        localStorage.setItem('adminId', result['user'][0]['adminId']);
        localStorage.setItem('telephone', result['user'][0]['telephone']);
        localStorage.setItem('adminemail', database);
        localStorage.setItem('user', JSON.stringify(result['user'][0]));
        localStorage.setItem('roles', JSON.stringify([numberId]));
        localStorage.setItem(
          'display',
          JSON.stringify(account['users'][0]['storeType'])
        );

        if (numberId === 4) {
          localStorage.setItem(
            'adminUser',
            JSON.stringify(account['users'][0])
          );

          this.desktop = false;
          this.router.navigateByUrl('point-of-sale');
          localStorage.setItem('route', 'point-of-sale');
          return;
        } else if (numberId === 2) {
          this.router.navigateByUrl('start');
          localStorage.setItem('route', 'start');
          return;
        } else if (numberId === 3) {
          this.router.navigateByUrl('warehouse');
          localStorage.setItem('route', 'warehouse');
          return;
        } else if (numberId === 5) {
          this.router.navigateByUrl('shop');
          localStorage.setItem('route', 'shop');
          return;
        } else if (numberId === 6) {
          this.router.navigateByUrl('start');
          localStorage.setItem('route', 'start');
          return;
        } else if (numberId === 8) {
          this.router.navigateByUrl('sc-home');
          localStorage.setItem('route', 'sc-home');
          return;
        } else if (numberId === 10) {
          this.router.navigateByUrl('sa-home');
          localStorage.setItem('route', 'sa-home');
          return;
        } else if (numberId === 7) {
          this.router.navigateByUrl('sw-home');
          localStorage.setItem('route', 'sw-home');
          return;
        } else if (numberId === 11) {
          this.router.navigateByUrl('hospital-home');
          localStorage.setItem('route', 'hospital-home');
          return;
        }
      };
      let role = {
        text: roles.name,
        cssClass: 'my-alert',
        handler: handle,
      };
      tabButtons.push(role);
    });
    const alert = await this.alertController.create({
      header: 'Choose account',
      buttons: tabButtons,
    });

    await alert.present();
  }

  async addLocalServerIp() {
    let IPI = '';
    if (localStorage.getItem('localIp')) {
      IPI = localStorage.getItem('localIp');
      IPI = `ip found: ${IPI}`;
    } else {
      IPI = 'ENTER IP';
    }
    const alert = await this.alertController.create({
      header: IPI,
      inputs: [
        {
          name: 'IP',
          //  type: 'number',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertCancel',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'SAVE',
          cssClass: 'alertButton',
          handler: (data) => {
            if (data) {
              console.log(data);
              let ip = data.IP;
              let arr: any[] = ip.split('.');
              console.log(ip.split('.'));
              if (arr.length !== 4) {
                this.notif.presentAlert('incorrect IP@');
              } else {
                this.urlService.changeLocalServerIp(ip);
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  testElectron() {}

  getSetting() {
    return new Promise((resolve, reject) => {
      this.adminService.getCompanySetting().subscribe(
        (data) => {
          // console.log('setting==>', data);

          if (data['company'] && data['company'].length) {
            let obj = data['company'][0];

            this.saveRandom.setSetting(obj);
            localStorage.setItem('setting', JSON.stringify(data['company']));
            localStorage.setItem(
              'useResource',
              JSON.stringify(obj['use_resource'])
            );
            localStorage.setItem(
              'manageStockWithService',
              JSON.stringify(obj['manageStockWithService'])
            );
            localStorage.setItem(
              'poslive',
              JSON.stringify(obj['use_pos_live'])
            );
            resolve(data);
          } else {
            resolve(true);
          }
        },
        (err) => {
          reject(false);
        }
      );
    });
  }
}
