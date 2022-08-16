import { Component, OnInit } from '@angular/core';
import {
  LoadingController,
  ModalController,
  NavParams,
  ToastController,
} from '@ionic/angular';
import { AdminService } from 'src/app/services/admin.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { GetStoreNameService } from 'src/app/services/get-store-name.service';
import { NotificationService } from 'src/app/services/notification.service';
import { RangeByStoreService } from 'src/app/services/range-by-store.service';
import { ResourcesService } from 'src/app/services/resources.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-employee-retailer-product-add',
  templateUrl: './employee-retailer-product-add.page.html',
  styleUrls: ['./employee-retailer-product-add.page.scss'],
})
export class EmployeeRetailerProductAddPage implements OnInit {
  storeTypeTab: any[];
  products = [];
  products2: any;
  productResto: any;
  productRestoItem: any[] = [];
  packs: any[] = [];
  packs2 = [];
  allProducts = [];
  pack2: any;
  totalItems = 0;
  totalPrice = 0;
  Reduction: any;
  Itemprice: any;
  isItemAvailable = false;
  isItemAvailable2 = false;
  checkRole: any;
  tabRole: any;
  btnProducts = false; //display bouton items
  btnAllProducts = false; //display bouton pack
  btnResto = false;
  btnPack = true;
  isLoading = false; //loadin controller flag
  cartValue: any;
  tabRoles = [];
  adminId: any;
  multiStoreProductitem: any;
  resourceItem: any;
  multiStoreResourceitem: any[] = [];

  multiStoreList: any[] = [];
  multiStoreService: any[] = [];
  totalBtl = 0;
  productListTab: any;
  productServiceTab: any;
  pet: any;
  afficheResource = false;
  constructor(
    // public toastController: ToastController,
    public modalController: ModalController,
    // public adminService: AdminService,
    // public loadingController: LoadingController,

    public rangeByStoreService: RangeByStoreService,
    public getStoreName: GetStoreNameService,
    private resourceService: ResourcesService,
    private restApiService: RestApiService,
    private saveRandom: SaverandomService,
    public authService: AuthServiceService,
    private notif: NotificationService
  ) {
    if (
      JSON.parse(localStorage.getItem('adminUser')) &&
      JSON.parse(localStorage.getItem('adminUser'))['storeType']
    ) {
      this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
        'storeType'
      ];
      if (
        this.storeTypeTab.includes('bar') ||
        this.storeTypeTab.includes('resto')
      ) {
        this.storeTypeTab.push('resource');
      }
      this.pet = this.storeTypeTab[0];
    }
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.getItems();
    this.storeTypeTab = JSON.parse(localStorage.getItem('adminUser'))[
      'storeType'
    ];

    this.pet = this.storeTypeTab[0];

    this.pet = this.storeTypeTab[0];
  }

  getItems() {
    this.takePack();

    setTimeout(() => {
      // this.takePackitems();
      this.takeProduct();
      // this.getResources();
      this.takeProductListShop();
      this.takeProductServiceList();
    }, 500);
    setTimeout(() => {
      this.takeProductResto();
    }, 1000);
  }

  closeModal() {
    this.modalController.dismiss('erico');
  }

  async takeProduct() {
    this.restApiService.getProductItem().subscribe(async (data: any[]) => {
      //this.products = data["items"];
      this.products = data;

      if (this.products.length > 0) {
        this.rangeByStoreService
          .rangeProductByStore(this.products)
          .then((res: any[]) => {
            console.log('this', res);

            this.multiStoreProductitem = res[0];
          });
      }
    });
  }

  async takePackitems() {
    /* this.restApiService.getProduct().subscribe((data) => {
      let tab = data['products'].filter((elt) => {
        return elt['desabled'] == false;
      });
      tab.forEach(async (elt) => {
        if (elt['resourceList'].length > 0) {
         
          this.packs = this.packs.filter((pack) => {
            return pack.productId !== elt._id;
          });
        } else {
          this.packs.forEach((pack) => {
            if (pack.productId == elt._id) {
              pack['packPrice'] = elt['packPrice'];
            }
          });
        }
      });
      this.rangeByStoreService.rangeProductByStore(this.packs).then((res) => {
        this.multiStoreProductitem = res;
      });
    }); */
  }

  removeToPack(elt) {
    return new Promise((resolve, reject) => {
      this.packs = this.packs.find((pack) => {
        return pack.productId !== elt._id;
      });
      console.log('========');

      console.log(this.packs);

      resolve('ok');
    });
  }

  takePack() {
    this.restApiService.getPack().subscribe(async (data) => {
      // this.packs = data["docs"];

      data.forEach((elt) => {
        elt.name.replace(/\s/g, '');
        elt['name'] = elt['name'].toUpperCase();
      });
      data.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
      this.packs = data;

      // tab = data;
      let setting = JSON.parse(localStorage.getItem('setting'))[0];

      if (this.packs.length > 0) {
        // this.allProducts = [...this.allProducts, ...this.packs];
      }
    });
  }

  getResources() {
    this.resourceService.getResourcesItem().subscribe((data) => {
      this.resourceItem = data['resources'].filter((elt) => {
        return elt['desabled'] == false;
      });
      this.rangeByStoreService
        .rangeProductByStore(this.resourceItem)
        .then((res: any[]) => {
          console.log(res);
          this.multiStoreResourceitem = res[0];
        });
    });
  }

  takeProductResto() {
    this.restApiService
      .getManufacturedProductItemResto2()
      .subscribe(async (data) => {
        // this.productResto = data;
        //this.products = data["items"];
        this.rangeByStoreService
          .rangeProductByStore(data)
          .then((res: any[]) => {
            this.productRestoItem = res[0];
            console.log('resto ici', this.productRestoItem);

            console.log(this.productRestoItem);
          });

        //this.productResto = data;
      });
  }

  takeProductServiceList() {
    this.restApiService.getBillardList().subscribe(async (data) => {
      let result: any = await this.rangeByStoreService.rangeProductByStore(
        data['product']
      );
      console.log('service list tab', result);
      this.multiStoreService = result[0];
    });
  }

  takeProductListShop() {
    this.restApiService.getShopList().subscribe(async (data) => {
      let result: any = await this.rangeByStoreService.rangeProductByStore(
        data['product']
      );

      this.multiStoreList = result[0];
      console.log('product list tab', this.multiStoreList);
    });
  }

  // buyItem($event) {}
  // buyPackProduct($event) {}
  // updatePackProduct($event) {}
  IncommingItems($event) {}

  segmentChanged(ev: any) {
    this.afficheResource = false;
    console.log('Segment changed', ev.target.value);
    let check = ev.target.value;

    if (check === 'resto') {
      // this.displayResource();
    }
  }

  save() {
    this.notif.presentLoading();
    this.authService.updateEmployee(this.saveRandom.getRetailer()).subscribe(
      (data) => {
        this.notif.dismissLoading();
        this.notif.presentToast('sauvegardé avec succé', 'success');
        this.modalController.dismiss();
      },
      (err) => {
        this.notif.dismissLoading();
        this.notif.presentToast(
          'erreur de sauvegarde certains paramétres sont incorrect ou verifier votre connexion internet',
          'danger'
        );
      }
    );
  }
}
