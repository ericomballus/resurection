import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Gamme } from 'src/app/models/gamme.model';
import { Product } from 'src/app/models/product.model';
import { PickResourcePage } from 'src/app/pick-resource/pick-resource.page';
import { GammeService } from 'src/app/services/gamme.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { ProductForGammePage } from '../product-for-gamme/product-for-gamme.page';

@Component({
  selector: 'app-gamme-add',
  templateUrl: './gamme-add.page.html',
  styleUrls: ['./gamme-add.page.scss'],
})
export class GammeAddPage implements OnInit {
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  file: File;
  url: any;
  Products: any;
  gamme: Gamme;
  storeId: any;
  userStore = [];
  constructor(
    private modalController: ModalController,
    public toastController: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private notifi: NotificationService,
    private gammeService: GammeService,
    private random: SaverandomService
  ) {}

  ngOnInit() {
    this.init();
    let user = JSON.parse(localStorage.getItem('user'));
    this.userStore = user[0]['storeId'];
    if (this.userStore.length == 1) {
      this.storeId = this.userStore[0]['id'];
    }
  }
  addGamme(form: NgForm) {
    if (this.formulaire.invalid) {
      this.notifi.presentFormError('formulaire invalide.!', 'danger');
      return;
    }
    this.notifi.presentLoading();
    this.gamme.name = form.value.name;
    this.gamme.sellingPrice = form.value.sellingPrice;
    delete this.gamme._id;
    var formData = new FormData();
    formData.append('name', this.gamme.name);
    formData.append('sellingPrice', form.value.sellingPrice);
    formData.append('productList', JSON.stringify(this.gamme.productList));
    formData.append('storeId', this.storeId);

    formData.append('image', this.file);
    this.gammeService.postGamme(formData).subscribe(
      (res) => {
        console.log(res);
        form.reset();
        this.notifi.dismissLoading();
        this.notifi.presentToast('save successfuly!!!', 'primary');
        this.gamme.productList.forEach((prod) => {
          this.remove(prod);
        });
      },
      (err) => {
        this.notifi.dismissLoading();
      }
    );
  }
  init() {
    this.gamme = new Gamme('', [], 0, '');
    console.log(this.gamme);
  }
  async pickResource() {
    this.gammeService.setGamme(this.gamme);
    this.random.setStoreId(this.storeId);
    const modal = await this.modalController.create({
      component: ProductForGammePage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      this.gamme = this.gammeService.getGamme();
    });
    return await modal.present();
  }

  closeModal() {}
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
    //console.log(this.file);
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.url = event.target.result;
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  async assignStore(ev) {
    console.log(ev.target.value);
    this.storeId = ev.target.value;
  }
}
