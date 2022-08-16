import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../services/rest-api.service';
import {
  ModalController,
  NavParams,
  LoadingController,
  AlertController,
} from '@ionic/angular';

@Component({
  selector: 'app-product-manufactured-item-add',
  templateUrl: './product-manufactured-item-add.page.html',
  styleUrls: ['./product-manufactured-item-add.page.scss'],
})
export class ProductManufacturedItemAddPage implements OnInit {
  prod: any;
  isLoading: any;
  constructor(
    public restApiService: RestApiService,
    public modalController: ModalController,
    navParams: NavParams,
    public loadingController: LoadingController,
    public alertController: AlertController
  ) {
    this.prod = navParams.get('product');
    console.log(this.prod);
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss('erico');
  }

  async register(form) {
    console.log(form.value);
    this.presentLoading();

    this.prod.productId = await this.prod._id;
    // await delete this.prod["_id"];
    this.restApiService
      .getOneManufacturedProductItemResto(this.prod._id)
      .subscribe((data) => {
        console.log(data);
        let id = data['docs'][0]['_id'];
        this.prod.id = id;
        let obj = { id: id, newquantity: form.value['newquantity'] };
        this.restApiService.updateManufacturedItem(obj).subscribe(
          (data) => {
            console.log(data);
            this.dismissLoading();
            this.modalController.dismiss('update');
          },
          (err) => {
            this.dismissLoading();
            this.modalController.dismiss('error');
          }
        );
      });
    /*  */
  }

  async presentLoading() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 6000,
      })
      .then((a) => {
        a.present().then(() => {
          // console.log("presented");
          if (!this.isLoading) {
            a.dismiss().then(() => console.log('abort presenting'));
          }
        });
      });
  }

  async dismissLoading() {
    this.isLoading = false;
    return await this.loadingController
      .dismiss()
      .then(() => console.log('dismissed'));
  }

  async presentAlert(form) {
    const alert = await this.alertController.create({
      header: 'ELPIS',
      subHeader: 'sauvegarde ok',
      //message: data.data.message,
      buttons: [
        {
          text: 'CANCEL',
          role: 'destructive',
          handler: () => {
            this.modalController.dismiss('dismiss');
          },
        },
        {
          text: 'OK',

          handler: () => {
            this.register(form);
          },
        },
      ],
    });

    await alert.present();
  }
}
