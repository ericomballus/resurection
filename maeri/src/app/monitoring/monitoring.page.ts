import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../services/rest-api.service';
import { Router } from '@angular/router';
import {
  NavController,
  ModalController,
  AlertController,
  ToastController,
  NavParams,
} from '@ionic/angular';
import { TranslateConfigService } from '../translate-config.service';
import { AdminService } from '../services/admin.service';
import { Socket } from 'ngx-socket-io';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.page.html',
  styleUrls: ['./monitoring.page.scss'],
})
export class MonitoringPage implements OnInit {
  items: any;
  cart: any;
  custumer: any;
  cashOpening: any;
  casgData: any;
  columns: any;
  rows: any;
  totalVente = 0;
  totalsaleProd = 0;
  openTicket = 0;
  cashDayTicket = 0;
  db: any;
  custumerId: any;
  company: any;
  constructor(
    navParams: NavParams,
    private restApiService: RestApiService,
    private router: Router,
    public navCtrl: NavController,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public alertController: AlertController,
    public adminService: AdminService,
    public toastController: ToastController,
    private socket: Socket,
    private cartService: CartService
  ) {
    console.log(navParams.get('custumer'));
    this.custumer = navParams.get('custumer');
    let a = this.custumer['email'].split('@');
    let b = a[1].split('.');
    this.db = a[0] + b[0] + b[1];
    this.custumerId = this.custumer['_id'];
    this.company = this.custumer['company'];
    this.takeCashOpen();
    this.webServerSocket(this.custumerId);
  }

  ngOnInit() {
    //this.takeCashOpen();
    // this.adminId = localStorage.getItem("adminId");
    // this.webServerSocket(this.adminId);
  }

  closeModal() {
    this.modalController.dismiss('erico');
  }
  takeCashOpen() {
    this.adminService
      .getOpenCashSudo(this.db, this.custumerId)
      .subscribe((data) => {
        console.log('cash', data);
        if (data['docs'].length) {
          this.cashOpening = data['docs'].length;
          this.casgData = data['docs'][0];
          localStorage.setItem('openCashDate', data['docs'][0]['openDate']);
          setTimeout(() => {
            this.takePaieInvoice();
          }, 2000);
        } else {
          this.presentToast('PLEASE OPEN CASH!');
        }
      });
  }
  takePaieInvoice() {
    this.adminService
      .getOrderSudo(this.db, this.custumerId)
      .subscribe((data) => {
        console.log('sale!!', data);
        this.getOrders();
        this.totalVente = 0;
        this.totalsaleProd = 0;
        this.rows = data['docs'];
        this.rows.forEach((elt) => {
          this.totalVente = this.totalVente + elt['totalSalesAmount'];
          //this.totalsaleProd = this.totalsaleProd + elt["quantity"];
        });
      });
  }

  getOrders() {
    this.adminService.getInvoiceNotPaieSudo(this.db, this.custumerId).subscribe(
      (data) => {
        console.log('orders!!', data);
        // l'ensemble des tickets ouvert
        this.openTicket = data['docs'].length;
        if (data && data['docs']) {
          // this.orders = data["docs"].reverse();
          data['cash'].forEach((elt) => {
            this.totalsaleProd = this.totalsaleProd + elt;
          });

          let tab = data['docs'].filter((elt) => {
            return elt.sale === false;
          });

          this.cashDayTicket = tab.length;
        }
      },
      (err) => {
        console.log('error here', err);
      }
    );
  }
  webServerSocket(id) {
    this.socket.connect();

    this.socket.fromEvent(`${id}buyOrder`).subscribe(async (data) => {
      console.log('buy order', data);
      this.presentToast2('new command');
      this.takePaieInvoice();
    });

    this.socket.fromEvent(`${id}newOrder!`).subscribe(async (data) => {
      console.log('new order', data);
      this.presentToast2('new order!');
      // this.cashDayTicket = this.cashDayTicket + 1;
      // this.openTicket = this.openTicket + 1;
      this.takePaieInvoice();
      /* if (data["confirm"]) {
       
      } else {
       
      } */
    });
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
      position: 'top',
      animated: true,
      //cssClass: "my-custom-class"
    });
    toast.present();
  }

  async presentToast2(msg) {
    const toast = await this.toastController.create({
      message: `${msg}`,
      duration: 2000,
      position: 'top',
      animated: true,
      cssClass: 'my-custom-classIn',
    });
    toast.present();
  }
}
