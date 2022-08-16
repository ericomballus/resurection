import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { UrlService } from '../services/url.service';
import { AdminService } from '../services/admin.service';
import { NotificationService } from '../services/notification.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  url: string;
  userRole: Boolean = false;
  productDisplayType = 'card';
  userStore = [];
  multi_store: Boolean = false;
  store = { name: '', ville: '', telephone: '', quartier: '' };
  custumerSetting: any;
  constructor(
    private authService: AuthServiceService,
    private router: Router, // private storage: Storage
    private urlService: UrlService,
    private adminService: AdminService,
    private notification: NotificationService
  ) {}

  ngOnInit() {}
  logValue(ev) {
    if (ev.detail.value === 'v') {
      this.userRole = true;
    } else {
      this.userRole = false;
    }
    console.log(this.userRole);
  }

  productType(ev) {
    if (ev.detail.value === 'list') {
      this.productDisplayType = 'list';
    } else {
      this.productDisplayType = 'card';
    }
  }
  async register(form) {
    console.log(form.value);
    let codeadmin = await form.value.firstName.split('@');
    // console.log(codeadmin);
    form.value.userRole = this.userRole;
    console.log(codeadmin.length);
    /* if (codeadmin.length === 4 && codeadmin[2] === "maeri") {
      form.value["role"] = "adminmaeri";
      form.value["email"] = codeadmin[0] + "@" + codeadmin[1];
    } else {
      form.value["role"] = "custumer";
    }*/

    // if (codeadmin[3] === "devmaeri") {
    if (form.value.firstName.includes('adminmaeridev')) {
      form.value['role'] = 'adminmaeri';
      form.value['email'] = form.value.firstName + '@' + 'maeri.com';
      /// localStorage.setItem('mode', 'test');
      // this.urlService.setTestServer();
      // alert(data);
      this.authService.register(form.value).subscribe(
        (res) => {
          this.router.navigateByUrl('admin-display-custumers');
        },
        (err) => {}
      );
    } else {
      // this.addStore().then((result) => {
      let sec = new Date().getSeconds();
      form.value['email'] = form.value.firstName + sec + '@' + 'customer.com';
      form.value['role'] = 'custumer';
      let user = form.value;
      // user["storeId"] = this.userStore;
      this.authService.register(user).subscribe(
        async (res) => {
          //  console.log(res);
          let user = res['message'];
          this.router.navigateByUrl('admin-display-custumers');
          // res["message"]["storeId"] = this.userStore;
          this.store.name = user['company'];
          this.store.quartier = user['city'];
          this.store.telephone = user['telephone'];
          this.store.ville = user['city'];
          let customer = this.createdStore(user);
          console.log('before send===>', customer);
          this.adminService.updateCustomer(customer).subscribe((data) => {
            // this.router.navigateByUrl("admin-display-custumers");
            let obj = {
              latitude: 0,
              longitude: 0,
              name: '',
              companyMail: 'company@email',
              phoneNumber: 0,

              stock_min: 0,
              stock_min_aut: 0,
              adminId: data['resultat']['_id'],
              //  productDisplayType: this.productDisplayType,
              multi_store: this.multi_store,
            };
            this.adminService
              .adminMaeriPostCompanySetting(obj)
              .subscribe((res) => {});
            // this.router.navigateByUrl("Login");
          });
        },
        (err) => {
          console.log(err);
          this.notification.presentError(err.error.message, 'danger');
        }
      );
      // });
    }
  }
  createdStore(custumer) {
    // return new Promise((resolve, reject) => {
    let idL =
      Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5) +
      custumer['_id'] +
      Date.now();
    let store = {};

    let obj = { numStore: 1, id: idL };
    store = { ...obj, ...this.store };
    this.userStore.push(store);

    // this.userStore.push(store);
    custumer['storeId'] = this.userStore;
    // resolve(custumer);
    // });
    return custumer;
  }
  /*  addStore() {
    // return new Promise((resolve, reject) => {
    if (this.multi_store) {
      let idL =
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, "")
          .substr(0, 5) + Date.now();
      let store = {};

      store = {
        numStore: this.userStore.length + 1,
        id: idL,
        name: `store ${this.userStore.length + 1}`,
      };

      this.userStore.push(store);
    }
  } */

  removeStore(store) {
    this.userStore = this.userStore.filter((elt) => {
      return elt.id != store.id;
    });
  }

  storeType(ev) {
    console.log(ev.target.value);
    if (ev.target.value === 'm') {
      this.multi_store = true;
      console.log(this.multi_store);
    } else {
      this.multi_store = false;
      /* this.userStore = [];
      let idL =
        Math.random()
          .toString(36)
          .replace(/[^a-z]+/g, '')
          .substr(0, 5) + Date.now();
      let store = {};

      store = {
        numStore: this.userStore.length + 1,
        id: idL,
        name: 'store 1',
      };

      this.userStore.push(store);*/
    }
  }

  /* updateWithoutExit(customer) {
    this.adminService.updateCustomer(customer).subscribe((data) => {
      this.updateCompanySetting(customer);
    });
  } */
  updateCompanySetting(customer) {
    let aut = 0;

    this.adminService
      .adminMaeriCustumerUpdateCompanySetting(
        this.custumerSetting,
        customer['_id']
      )
      .subscribe((data) => {
        console.log(data);

        // this.notif.presentToast("");
      });
  }
  getSetting(customer) {
    this.adminService
      .adminMaeriCustumerCompanySetting(customer['_id'])
      .subscribe((data) => {
        if (data['company'].length) {
          this.custumerSetting = data['company'][0];
        }
      });
  }
}
