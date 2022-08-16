import { Component, OnInit } from '@angular/core';
import { SelectvendorService } from 'src/app/services/selectvendor.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-vendor-cart',
  templateUrl: './vendor-cart.page.html',
  styleUrls: ['./vendor-cart.page.scss'],
})
export class VendorCartPage implements OnInit {
  cart: any;
  vendor: any;
  isLoading = false;
  date: any;
  constructor(
    private selectVendor: SelectvendorService,
    public restApiService: RestApiService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private router: Router,
    private notif: NotificationService
  ) {
    this.cart = this.selectVendor.getCart();
    this.vendor = this.selectVendor.getData();
    console.log(this.cart);
    console.log(this.vendor);
    console.log(JSON.parse(localStorage.getItem('user')));
  }

  ngOnInit() {}
  changePrice($event, prod) {}
  getLivraisonTime(ev) {
    this.date = new Date(ev.target.value);
  }
  sendCommande() {
    console.log(this.cart);
    let retailer = JSON.parse(localStorage.getItem('user'));
    let order = {
      retailerId: this.vendor.retailerId,
      vendorId: this.vendor.vendorId._id,
      commandes: this.cart,
      company: retailer[0].company,
      retailer: retailer,
    };
    if (this.date) {
      order['dateLivraison'] = this.date;
      this.presentLoading2();

      this.selectVendor.postOrder(order).subscribe((data) => {
        console.log(data);

        this.dismissLoading();
        this.presentToast();
        console.log(order);
        this.sendTofirebase(order);
        this.cart = null;
        setTimeout(() => {
          this.router.navigateByUrl('/start');
        }, 500);
      });
    } else {
      this.notif.presentToast(
        'veillez choisir une heure pour livraison',
        'danger'
      );
      return;
    }
    console.log(order);
  }

  sendTofirebase(data) {
    console.log(data);
    /*  let data = {
      cart: body["cart"],
      adminId: localStorage.getItem("adminId"),
      tableNumber: body["tableNumber"],
      confirm: confirm,
      Posconfirm: Posconfirm,
      openCashDate: openCashDate,
      openCashDateId: openCashDateId,
      userName: body["userName"],
      numFacture: body["numFacture"],
      localId: body["localId"],
    };*/
  }
  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 8000,
        message: 'please wait ...',
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then();
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Votre commande a été transmise',
      duration: 5000,
      position: 'middle',
      color: 'success',
    });
    toast.present();
  }
}
