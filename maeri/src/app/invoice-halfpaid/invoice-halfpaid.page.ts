import { Component, OnInit, ViewChild } from "@angular/core";
import { AdminService } from "../services/admin.service";
import { ModalController } from "@ionic/angular";
import { DetailsPage } from "../point-of-sale/details/details.page";
import { IonInfiniteScroll } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { TranslateConfigService } from "src/app/translate-config.service";

@Component({
  selector: "app-invoice-halfpaid",
  templateUrl: "./invoice-halfpaid.page.html",
  styleUrls: ["./invoice-halfpaid.page.scss"],
})
export class InvoiceHalfpaidPage implements OnInit {
  invoices = [];
  tabRoles = [];
  admin: boolean = false;
  manager: boolean = false;
  numPage = 0;
  nbrPages = 0;
  traduction: boolean = false;
  @ViewChild(IonInfiniteScroll, { static: false })
  infiniteScroll: IonInfiniteScroll;

  constructor(
    private adminService: AdminService,
    public modalController: ModalController,
    private translateConfigService: TranslateConfigService,
    public translate: TranslateService
  ) {
    this.getOrders();
    this.languageChanged();
    this.tabRoles = JSON.parse(localStorage.getItem("roles"));
    if (
      this.tabRoles.includes("admin") ||
      this.tabRoles.includes("caissiére") ||
      this.tabRoles.includes("manager")
    ) {
      // this.getInvoice();
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
    this.adminService.getInvoiceHalfPaid().subscribe(
      (data) => {
        console.log(data);
        if (data && data["docs"]["docs"]) {
          this.invoices = data["docs"]["docs"];
          this.numPage = data["docs"]["page"];
          this.nbrPages = data["docs"]["pages"];
        }
      },
      (err) => {
        console.log("error here", err);
      }
    );
  }
  async displayDetails(order) {
    const modal = await this.modalController.create({
      component: DetailsPage,
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
    let num = this.numPage + 1;
    console.log(this.invoices.length);
    if (num > this.nbrPages) {
      event.target.disabled = true;
      return;
    }

    this.adminService.getInvoicePaie2(num).subscribe(
      (data) => {
        event.target.complete();
        console.log(data);
        if (data && data["docs"]["docs"]) {
          // this.invoices.push(data["docs"]["docs"]);
          this.numPage = parseInt(data["docs"]["page"]);
          this.nbrPages = data["docs"]["pages"];
          let tab = [...this.invoices, ...data["docs"]["docs"]];
          this.invoices = tab;
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

  getOrders() {
    this.adminService.getInvoiceHalfPaid().subscribe(
      (data) => {
        console.log(data);
        if (data && data["docs"]) {
          this.invoices = data["docs"];
        }
      },
      (err) => {
        console.log("error here", err);
      }
    );
  }
}
