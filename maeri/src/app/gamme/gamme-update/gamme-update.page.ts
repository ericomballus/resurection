import { Component, OnInit, ViewChild } from '@angular/core';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Gamme } from 'src/app/models/gamme.model';
import { Product } from 'src/app/models/product.model';
import { GammeService } from 'src/app/services/gamme.service';
import { ImageStoreService } from 'src/app/services/image-store.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ProductForGammePage } from '../product-for-gamme/product-for-gamme.page';

@Component({
  selector: 'app-gamme-update',
  templateUrl: './gamme-update.page.html',
  styleUrls: ['./gamme-update.page.scss'],
})
export class GammeUpdatePage implements OnInit {
  @ViewChild('fileButton', { static: false }) fileButton;
  Products: any;
  gamme: Gamme;
  oldProductList: Product[];
  oldObj: Gamme;
  file: File;
  url = false;
  userStore: any;
  storeId: any;
  constructor(
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private notifi: NotificationService,
    private gammeService: GammeService,
    private imageService: ImageStoreService,
    private random: SaverandomService
  ) {}

  ngOnInit() {
    let obj = this.gammeService.getGamme();
    this.gamme = new Gamme(
      obj.name,
      obj.productList,
      obj.sellingPrice,
      obj._id,
      obj.created
    );
    if (obj.url) {
      this.gamme.url = obj.url;
    }
    if (obj.newUrl) {
      this.gamme.newUrl = obj.newUrl;
    }
    this.gamme.productType = obj.productType;
    this.gamme.desabled = obj.desabled;
    localStorage.setItem('oldGamme', JSON.stringify(obj));
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    this.gamme.storeId = obj.storeId;
    //  this.storeId = this.userStore[0]['id'];

    /* if (this.userStore.length > 1 && !obj.storeId) {
      this.storeId = this.userStore[0]['id'];

      this.gamme.storeId = this.storeId;
    } else {
      if (this.userStore.length && !obj.storeId) {
        this.storeId = this.userStore[0]['id'];
        console.log(this.storeId);

        this.gamme.storeId = this.storeId;
        console.log(this.gamme);
      }
    }*/
  }

  async update() {
    this.notifi.presentLoading();
    this.gamme.productType = 'Gamme';
    if (this.storeId) {
      this.gamme.storeId = this.storeId;
    }
    if (this.url) {
      var formData = new FormData();
      formData.append('image', this.file);

      this.imageService
        .postImages(formData)
        .then((url: string) => {
          this.gamme.newUrl = url;

          this.gammeService.updateGamme(this.gamme).subscribe((res: Gamme) => {
            this.notifi.dismissLoading();
            this.notifi.presentToast('update successfuly!!', 'primary');
            this.modalController.dismiss();
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      delete this.gamme.url;
      delete this.gamme.newUrl;
      this.gammeService.updateGamme(this.gamme).subscribe((res: Gamme) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('update successfuly!!', 'primary');
        this.modalController.dismiss();
      });
    }
  }

  closeModal() {
    localStorage.removeItem('oldGamme');
    console.log('je sors ici', this.gammeService.getGamme());

    this.modalController.dismiss({ cancel: true });
  }

  async pickResource() {
    this.gammeService.setGamme(this.gamme);
    this.random.setStoreId(this.gamme.storeId);

    const modal = await this.modalController.create({
      component: ProductForGammePage,
      componentProps: {},
      backdropDismiss: false,
    });
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data['cancel'] == true) {
        this.gamme.productList = [];
        this.gamme.productList = JSON.parse(localStorage.getItem('oldGamme'))[
          'productList'
        ];
        this.gammeService.setGamme(this.gamme);
      } else {
        this.gamme = this.gammeService.getGamme();
      }
    });
    return await modal.present();
  }
  remove(prod: Product) {
    this.gamme.removeToProductList(prod);
  }
  addQuantity(ev, prod, i) {
    let nbr = parseInt(ev.detail.value);
    console.log(Number.isNaN(nbr));

    if (Number.isNaN(nbr)) {
      this.gamme.productList[i].toRemove = 1;
    } else {
      this.gamme.productList[i].toRemove = nbr;
    }
    console.log(this.gamme.productList);
  }
  readUrl(event: any) {
    // this.flag_product = "ok";
    this.file = event.target.files[0];
    console.log(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.gamme.url = event.target.result;
        this.url = true;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  galerie() {
    this.fileButton.nativeElement.click();
  }
  async assignStore(ev) {
    console.log(ev.target.value);
    this.storeId = ev.target.value;
  }
}
