import { Component, OnInit, ViewChild } from "@angular/core";
import { AdminService } from "../services/admin.service";
import { ModalController, LoadingController } from "@ionic/angular";
import { DetailsPage } from "../point-of-sale/details/details.page";
import { IonInfiniteScroll } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/translate-config.service";
import { DisplayInvoicePage } from "../display-invoice/display-invoice.page";
@Component({
  selector: "app-invoice-paie",
  templateUrl: "./invoice-paie.page.html",
  styleUrls: ["./invoice-paie.page.scss"],
})
export class InvoicePaiePage implements OnInit {
  invoices = [];
  tabRoles = [];
  allInvoices = [];
  admin: boolean = false;
  manager: boolean = false;
  numPage = 0;
  nbrPages = 0;
  btn1: Boolean = false;
  btn2: Boolean = false;
  btn3: Boolean = false;
  btn4: Boolean = false;
  btn5: Boolean = false;
  btn0: Boolean = false;
  all = 0;
  nonpaye = 0;
  paye = 0;
  partiel = 0;
  annule = 0;
  ouvert = 0;
  paye2 = 0;
  openCashDateId: any;
  traduction: boolean = false;
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;
  constructor(
    private adminService: AdminService,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService,
    public loadingController: LoadingController
  ) {
    this.openCashDateId = JSON.parse(localStorage.getItem("openCashDateObj"))[
      "_id"
    ];
    setTimeout(() => {
      this.getAll();
    }, 1000);
    this.languageChanged();
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (
      this.tabRoles.includes("admin") ||
      this.tabRoles.includes("caissiére") ||
      this.tabRoles.includes("manager")
    ) {
      //this.getInvoice();
    }
    if (this.tabRoles.includes("admin")) {
      this.admin = true;
    }
    if (this.tabRoles.includes("manager")) {
      this.manager = true;
    }
  }

  ngOnInit() {}

  getInvoice() {
    //  this.adminService.getOrder2().subscribe(

    this.btn1 = true;
    this.btn2 = false;
    this.btn3 = false;
    this.btn4 = false;
    this.btn0 = false;
    this.btn5 = false;
    this.invoices = this.allInvoices.filter((elt) => {
      return elt.cash == true;
    });
    console.log(this.invoices);

    // this.invoices = data["docs"];
  }

  getAll() {
    this.presentLoading();
    let tab = [];
    tab = JSON.parse(localStorage.getItem(`userCommande`));
    if (tab && tab.length) {
      this.useStorageData(tab, this.openCashDateId);
      return;
    } else {
      this.adminService.getOrder2(1).subscribe(
        (data) => {
          console.log(data);
          console.log(data["docs"]);

          this.numPage = parseInt(data["docs"]["page"]);
          this.nbrPages = data["docs"]["pages"];
          this.btn0 = true;
          this.btn1 = false;
          this.btn2 = false;
          this.btn3 = false;
          this.btn4 = false;
          this.btn5 = false;
          if (data && data["docs"]["docs"]) {
            this.allInvoices = data["docs"]["docs"].filter((elt) => {
              return elt.openCashDateId === this.openCashDateId;
            });
            this.invoices = this.allInvoices;
            this.nonpaye = this.invoices.filter((elt) => {
              return elt.onAccount == true;
            }).length;

            this.partiel = this.invoices.filter((elt) => {
              return elt.partially == true;
            }).length;

            this.annule = this.invoices.filter((elt) => {
              return elt.invoiceCancel == true;
            }).length;

            this.paye = this.invoices.filter((elt) => {
              return elt.cash == true;
            }).length;

            this.paye2 = this.invoices.filter((elt) => {
              return elt.cash == true && elt.onAccount == false;
            }).length;

            this.ouvert = this.invoices.filter((elt) => {
              if (elt.sale == false) {
                // console.log(elt);
              }

              return (
                elt.sale == false &&
                elt.invoiceCancel == false &&
                elt.partially == false &&
                elt.onAccount == false
              );
            }).length;

            this.all = this.invoices.length;
          }
        },
        (err) => {
          console.log("error here", err);
        }
      );
    }
  }
  async displayDetails(order) {
    const modal = await this.modalController.create({
      component: DisplayInvoicePage,
      componentProps: {
        order: order,
        flags: true,
      },
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }

  loadData(event) {
    /* setTimeout(() => {
      console.log("Done");
      event.target.complete();

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (this.invoices.length == 1000) {
        event.target.disabled = true;
      }
    }, 500); */
    this.openCashDateId = localStorage.getItem("openCashDateId");
    let num = this.numPage + 1;

    if (num > this.nbrPages) {
      event.target.disabled = true;
      return;
    }
    console.log("pages", num);
    this.adminService.getOrder2(num).subscribe(
      (data) => {
        event.target.complete();
        // console.log(data);
        if (data && data["docs"]["docs"]) {
          // this.invoices.push(data["docs"]["docs"]);
          this.numPage = parseInt(data["docs"]["page"]);
          this.nbrPages = data["docs"]["pages"];
          let tab = [...this.allInvoices, ...data["docs"]["docs"]];
          this.allInvoices = tab;

          this.allInvoices = data["docs"]["docs"].filter((elt) => {
            return elt.openCashDateId === this.openCashDateId;
          });
          this.invoices = [...this.invoices, ...this.allInvoices];

          this.all = this.invoices.length;
          this.nonpaye = this.invoices.filter((elt) => {
            return elt.onAccount == true;
          }).length;

          this.partiel = this.invoices.filter((elt) => {
            return elt.partially == true;
          }).length;

          this.annule = this.invoices.filter((elt) => {
            return elt.invoiceCancel == true;
          }).length;

          this.paye = this.invoices.filter((elt) => {
            return elt.cash == true;
          }).length;
          this.paye2 = this.invoices.filter((elt) => {
            return elt.cash == true && elt.onAccount == false;
          }).length;

          this.ouvert = this.invoices.filter((elt) => {
            if (elt.sale == false) {
            }

            return (
              elt.sale == false &&
              elt.invoiceCancel == false &&
              elt.partially == false &&
              elt.onAccount == false
            );
          }).length;
        }
      },
      (err) => {
        console.log("error here", err);
      }
    );
  }
  languageChanged() {
    console.log("lang shop page");
    let lang = localStorage.getItem("language");
    if (lang) {
      this.translateConfigService.setLanguage(lang);
    }
  }

  getNonPaye() {
    this.btn1 = false;
    this.btn2 = true;
    this.btn3 = false;
    this.btn4 = false;
    this.btn0 = false;
    this.btn5 = false;
    this.invoices = this.invoices.filter((elt) => {
      return elt.onAccount == false;
    });

    /*  this.adminService.getInvoiceNotPaie().subscribe(
      (data) => {
        console.log(data);
        if (data && data["docs"]) {
          this.invoices = data["docs"];
        }
      },
      (err) => {
        console.log("error here", err);
      }
    ); */
  }

  getHalfPaie() {
    this.btn1 = false;
    this.btn2 = false;
    this.btn3 = true;
    this.btn4 = false;
    this.btn0 = false;
    this.btn5 = false;
    this.invoices = this.invoices.filter((elt) => {
      return elt.partially == true;
    });
  }

  async getAnnule() {
    this.btn1 = false;
    this.btn2 = false;
    this.btn3 = false;
    this.btn4 = true;
    this.btn0 = false;
    this.btn5 = false;
    this.invoices = this.invoices.filter((elt) => {
      return elt.invoiceCancel == true;
    });
  }

  getOuvert() {
    /* this.btn1 = false;
    this.btn2 = false;
    this.btn3 = false;
    this.btn4 = false;
    this.btn0 = false;
    this.btn5 = true;
    this.invoices = this.allInvoices.filter((elt) => {
      return elt.sale == false;
    }); */
    let tab = this.invoices.filter((elt) => {
      return (
        elt.sale == false &&
        elt.invoiceCancel == false &&
        elt.partially == false &&
        elt.onAccount == false
      );
    });

    console.log(tab);
    console.log(this.ouvert);
    console.log(tab.length);
    let sum = 0;
    tab.forEach((elt) => {
      elt["commandes"].forEach((arr) => {
        arr["products"].forEach((prod) => {
          sum = sum + parseInt(prod["price"]);
        });
      });
    });
    console.log(sum);
  }

  useStorageData(dataInStorage, openCashDateId) {
    this.btn0 = true;
    this.btn1 = false;
    this.btn2 = false;
    this.btn3 = false;
    this.btn4 = false;
    this.btn5 = false;
    if (dataInStorage) {
      this.allInvoices = dataInStorage.filter((elt) => {
        return elt.openCashDateId === this.openCashDateId;
      });
      this.invoices = this.allInvoices.reverse();
      this.nonpaye = this.invoices.filter((elt) => {
        return elt.onAccount == true;
      }).length;

      this.partiel = this.invoices.filter((elt) => {
        return elt.partially == true;
      }).length;

      this.annule = this.invoices.filter((elt) => {
        return elt.invoiceCancel == true;
      }).length;

      this.paye = this.invoices.filter((elt) => {
        return elt.cash == true;
      }).length;

      this.ouvert = this.invoices.filter((elt) => {
        if (elt.sale == false) {
          console.log(elt);
        }

        return (
          elt.sale == false &&
          elt.invoiceCancel == false &&
          elt.partially == false &&
          elt.onAccount == false
        );
      }).length;

      this.all = this.invoices.length;
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Patientez...",
      duration: 4000,
    });
    await loading.present();
    // const { role, data } = await loading.onDidDismiss();
    //  console.log('Loading dismissed!');
  }
}
