import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Product } from 'src/app/models/product.model';
import { CatService } from 'src/app/services/cat.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { MadebyService } from 'src/app/services/madeby.service';
@Component({
  selector: 'app-admin-product-update',
  templateUrl: './admin-product-update.page.html',
  styleUrls: ['./admin-product-update.page.scss'],
})
export class AdminProductUpdatePage implements OnInit {
  file: File;
  url: any;
  prod: Product;
  categorys: Array<any>;
  mades: Array<any>;
  madeselect: any;
  constructor(
    private modalController: ModalController,
    navParams: NavParams,
    private categorieSerice: CatService,
    public restApi: RestApiService,
    public madebyService: MadebyService
  ) {
    this.prod = navParams.get('products');
    console.log(this.prod);
    if (this.prod['url']) {
      this.url = this.prod['url'];
    }
    this.getMade();
    this.getCategories();
  }

  ngOnInit() {}

  closeModal() {
    // this.modalController.dismiss(this.products);
    this.modalController.dismiss(this.prod);
  }

  getMade() {
    this.madebyService.getMarieMadeby().subscribe((data) => {
      console.log(data);
      this.mades = data['madeby'];
    });
  }

  getCategories() {
    this.categorieSerice.getMarieCategories().subscribe((data) => {
      console.log(data);
      this.categorys = data['category'];
      this.categorys.forEach((elt) => {
        if (elt._id == this.prod['categoryId']) {
          console.log('correspond ici', elt);
          this.prod['categoryName'] = elt.name;
        }
      });
    });
  }

  test(ev: Event) {
    console.log(ev.target['value']);
    let productId = ev.target['value'];

    let category_select = this.categorys.filter(
      (item) => item['_id'] === productId
    )[0];

    console.log(category_select);
    this.prod.categoryName = category_select['name'];
    this.prod['categoryId'] = category_select['_id'];
  }

  made(ev: Event) {
    console.log(ev);
    console.log(ev.target['value']);

    this.madeselect = this.mades.filter(
      (item) => item['_id'] === ev.target['value']
    )[0]['name'];
    // console.log(this.madeselect);

    this.prod.produceBy = this.madeselect;
  }

  unitMeasure(ev: Event) {
    console.log(ev.target['value']);
    this.prod.unitName = ev.target['value'];
  }
  register(form) {
    console.log(this.prod);
    // console.log(form.value);
    if (this.file) {
      var formData = new FormData();
      formData.append('produceBy', this.prod['produceBy']);
      formData.append('categoryId', this.prod['categoryId']);
      formData.append('categoryName', this.prod['categoryName']);
      formData.append('name', this.prod['name']);
      formData.append(
        'purchasingPrice',
        JSON.stringify(this.prod['purchasingPrice'])
      );
      formData.append('sellingPrice', JSON.stringify(this.prod.sellingPrice));
      formData.append('description', this.prod.description);
      formData.append('packSize', JSON.stringify(this.prod.packSize));
      formData.append('packPrice', JSON.stringify(this.prod.packPrice));
      formData.append('ristourne', JSON.stringify(this.prod.ristourne));
      formData.append('sizeUnit', JSON.stringify(this.prod.sizeUnit));
      formData.append('unitName', this.prod.unitName);
      formData.append('image', this.file);
      formData.append('_id', this.prod._id);
      this.restApi.updateMaeriProductImage(formData).subscribe((data) => {
        console.log(data);
        console.log(data['url']);

        data['resultat']['url'] = data['url'];
        this.prod = data['resultat'];
        this.modalController.dismiss(data['resultat']);
      });
    } else {
      this.restApi.updateMaeriProduct(this.prod).subscribe((data) => {
        this.prod = data['resultat'];
        this.modalController.dismiss(this.prod);
      });
    }
  }
  done(prod) {
    this.modalController.dismiss(prod);
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
}
