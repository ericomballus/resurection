import { Component, OnInit, ViewChild } from '@angular/core';
import { CatService } from '../services/cat.service';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
//import { ProductItemModalPage } from "../product-item-modal/product-item-modal.page";
@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  categories: any;
  tabRoles = [];
  admin: boolean = false;
  originPage: String = '';
  constructor(
    private catService: CatService,
    public modalController: ModalController,
    public alertController: AlertController,
    private route: ActivatedRoute,
    private categorieSerice: CatService
  ) {
    this.tabRoles = JSON.parse(localStorage.getItem('roles'));
    if (this.tabRoles.includes(1)) {
      // this.getCategories();
      this.admin = true;
    }
    this.getCategories();
  }

  ngOnInit() {
    this.route.queryParams
      //.filter(params => params.order)
      .subscribe((params) => {
        console.log(params); // { order: "popular" }

        this.originPage = params.page;
        console.log(this.originPage); // popular
      });
  }

  register(form) {
    console.log(form.value);
    form.value['page'] = this.originPage;
    this.catService.addUserCategories(form.value).subscribe((data) => {
      this.formulaire.reset();
      // console.log(data);
      this.getCategories();
      //  this.presentAlert();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'MAERI',
      message: 'success!!!!',
      buttons: ['OK'],
    });

    await alert.present();
  }

  getCategories() {
    this.catService.getCategories().subscribe((data) => {
      this.getMaeriCategories();
      this.categories = data['category'].filter((elt) => {
        if (elt.page) {
          return elt.page == this.originPage;
        }
      });
    });
  }
  getMaeriCategories() {
    this.categorieSerice.getMarieCategories().subscribe((data) => {
      console.log(data);
      this.categories = [...this.categories, ...data['category']];
    });
  }

  deleteCategories(cat) {
    this.catService.deleteCategories(cat._id).subscribe((data) => {
      console.log(data);
      this.getCategories();
    });
  }

  async createCategory() {
    const alert = await this.alertController.create({
      header: 'MAERI',
      message: 'success!!!!',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
