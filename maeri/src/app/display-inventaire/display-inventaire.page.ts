import { Component, OnInit } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import { AdminService } from "../services/admin.service";
import { Router } from "@angular/router";
import { RestApiService } from "../services/rest-api.service";

@Component({
  selector: "app-display-inventaire",
  templateUrl: "./display-inventaire.page.html",
  styleUrls: ["./display-inventaire.page.scss"],
})
export class DisplayInventairePage implements OnInit {
  invoices: any;
  isLoading = false;
  total_amount: number = 0;
  total_glace: number = 0;
  total_nonglace: number = 0;
  total_ristourne: number = 0;
  total_quantity: number = 0;
  openCashDate: any;
  totalBu = 0;
  totalBenefice = 0;
  totalProduct = 0;
  totalOut = 0;
  totalReste = 0;
  totalEx = 0;
  totalLost = 0;
  totalRistourne = 0;
  openCash = 0;
  closeCash = 0;
  TotalCash = 0;
  displayAmount = 0;
  reback: Boolean = false;
  storeId: any;
  d: any;
  manageStockWithService = false;
  constructor(
    public loadingController: LoadingController,
    public adminService: AdminService,
    public route: Router,
    public resApi: RestApiService
  ) {
    this.getInventory();
  }

  ngOnInit() {
    localStorage.removeItem("firstTime");
  }
  getSetting() {
    let setting = JSON.parse(localStorage.getItem("setting"));
    console.log(setting);
    if (setting.length) {
      this.manageStockWithService = setting[0]["manageStockWithService"];
    } else {
      if (setting["manageStockWithService"]) {
        //console.log(setting["manageStockWithService"]);

        this.manageStockWithService = setting["manageStockWithService"];
      }
    }
  }
  goToStartPage() {
    // console.log("hello");
    this.route.navigateByUrl("inventaire-list");
  }
  getInventory() {
    // this.presentLoading2();
    // dhello = JSON.parse(localStorage.getItem("d"));
    if (!this.manageStockWithService) {
      this.adminService.getAdminInventory().subscribe((data) => {
        console.log(data);
        /*  data["docs"] = data["docs"].filter((inv) => {
          return inv["out"] > 0;
        });*/

        this.openCash = 0;
        data["docs"].forEach((prod) => {
          prod["name"] = prod["name"].toUpperCase();
        });
        this.invoices = data["docs"].sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        this.openCash = data["cash"]["cashFund"];
        this.closeCash = data["cash"]["closing_cash"];

        this.invoices.forEach((elt) => {
          if (elt.totalSalesAmount) {
            this.total_amount = this.total_amount + elt.totalSalesAmount;
          }

          if (elt.ristourneGenerate) {
            this.total_ristourne = this.total_ristourne + elt.ristourneGenerate;
          }
          if (elt.beneficeTotal) {
            this.totalBenefice = this.totalBenefice + elt.beneficeTotal;
          }

          this.totalProduct = this.totalProduct + elt.start;
          this.totalOut = this.totalOut + elt.out;
          if (elt.remaining) {
            this.totalReste =
              this.totalReste + (elt.start - elt.out - elt.remaining);
          } else if (elt.more) {
            this.totalReste = this.totalReste + (elt.start - elt.out);
          } else {
            this.totalReste = this.totalReste + (elt.start - elt.out);
          }
          // this.totalBu= this.totalBu + elt.beneficeUnitaire;
          if (elt.remaining) {
            this.totalBu = this.totalBu + elt.remaining;
          }
          if (elt.more) {
            console.log("hello", elt.more);

            this.totalEx = this.totalEx + elt.more;
          }
          if (elt.remaining) {
            // this.totalLost = this.totalLost + elt.remaining;
          }
          this.total_quantity = this.total_quantity + elt.out;
        });
        /* this.TotalCash = this.closeCash - (this.total_amount + this.openCash);
        if (this.TotalCash < 0) {
          this.displayAmount = -1 * this.TotalCash;
        } else {
          this.displayAmount = 0;
        } */

        this.TotalCash = this.total_amount + this.openCash - this.closeCash;
        if (this.TotalCash < 0) {
          this.displayAmount = -1 * this.TotalCash;
        } else {
          this.displayAmount = 0;
        }

        localStorage.removeItem("orherIdDay");
        let d = JSON.parse(localStorage.getItem("openCashDateObj"))["_id"];
        this.getProductItem(d);

        //- this.closeCash
      });
    } else {
      if (JSON.parse(localStorage.getItem("open"))) {
        // let d = JSON.parse(localStorage.getItem("d"));

        this.makeInventaireRandom(this.d);
      } else {
        this.adminService.getAdminInventory().subscribe((data) => {
          // console.log(data);
          // console.log(JSON.parse(localStorage.getItem("d")));
          let tab = [];
          //  tab=  data["docs"]
          tab = data["docs"].filter((inv) => {
            return inv["out"] > 0;
          });
          tab.forEach((prod) => {
            prod["name"] = prod["name"].toUpperCase();
          });
          this.openCash = 0;
          // this.invoices = data["docs"];
          this.openCash = data["cash"]["cashFund"];
          this.closeCash = data["cash"]["closing_cash"];

          this.invoices = tab.sort((a, b) =>
            a.name > b.name ? 1 : b.name > a.name ? -1 : 0
          );

          if (JSON.parse(localStorage.getItem("cashClose"))) {
            /* this.closeCash = parseInt(
              JSON.parse(localStorage.getItem("cashClose"))
            ); */
          } else {
            this.closeCash = data["cash"]["closing_cash"];
          }

          //  this.dismissLoading();
          this.invoices.forEach((elt) => {
            console.log(elt);

            if (elt.totalSalesAmount) {
              this.total_amount = this.total_amount + elt.totalSalesAmount;
            }

            if (elt.ristourneGenerate) {
              this.total_ristourne =
                this.total_ristourne + elt.ristourneGenerate;
            }
            if (elt.beneficeTota) {
              this.totalBenefice = this.totalBenefice + elt.beneficeTotal;
            }

            this.totalProduct = this.totalProduct + elt.start;
            this.totalOut = this.totalOut + elt.out;
            if (elt.remaining) {
              this.totalReste =
                this.totalReste + (elt.start - elt.out - elt.remaining);
            } else if (elt.more) {
              this.totalReste = this.totalReste + (elt.start - elt.out);
            } else {
              this.totalReste = this.totalReste + (elt.start - elt.out);
            }
            // this.totalBu= this.totalBu + elt.beneficeUnitaire;
            if (elt.remaining) {
              this.totalBu = this.totalBu + elt.remaining;
            }
            if (elt.more) {
              this.totalEx = this.totalEx + elt.more;
            }
            if (elt.more) {
              this.totalLost = this.totalLost + elt.more;
            }
            this.total_quantity = this.total_quantity + elt.out;
          });
          this.TotalCash = this.total_amount + this.openCash - this.closeCash;
          if (this.TotalCash < 0) {
            this.displayAmount = -1 * this.TotalCash;
          } else {
            this.displayAmount = 0;
          }
          //- this.closeCash
          console.log(this.displayAmount);
          console.log(this.TotalCash);
          this.getProductItem(this.d);
        });
      }
    }
  }
  async presentLoading2() {
    this.isLoading = true;
    return await this.loadingController
      .create({
        duration: 60000,
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

  makeInventaireRandom(d) {
    console.log(this.d);

    this.adminService.getAdminInventoryRandom(d).subscribe((data) => {
      console.log(data);
      this.total_amount = 0;
      data["docs"].forEach((prod) => {
        prod["name"] = prod["name"].toUpperCase();
      });
      this.openCash = d.cashFund;
      this.closeCash = 0;
      data["docs"] = data["docs"].filter((inv) => {
        return inv["out"] > 0;
      });
      this.invoices = data["docs"].sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );

      this.invoices.forEach((elt) => {
        if (elt.totalSalesAmount) {
          this.total_amount = this.total_amount + elt.totalSalesAmount;
        }

        if (elt.ristourneGenerate) {
          this.total_ristourne = this.total_ristourne + elt.ristourneGenerate;
        }
        if (elt.beneficeTota) {
          this.totalBenefice = this.totalBenefice + elt.beneficeTotal;
        }

        this.totalProduct = this.totalProduct + elt.start;
        this.totalOut = this.totalOut + elt.out;
        if (elt.remaining) {
          this.totalReste =
            this.totalReste + (elt.start - elt.out - elt.remaining);
        } else if (elt.more) {
          this.totalReste =
            this.totalReste + (elt.start - elt.out) + elt.remaining;
        } else {
          this.totalReste = this.totalReste + (elt.start - elt.out);
        }
        // this.totalBu= this.totalBu + elt.beneficeUnitaire;
        if (elt.remaining) {
          this.totalBu = this.totalBu + elt.remaining;
        }
        if (elt.more) {
          this.totalEx = this.totalEx + elt.more;
        }
        if (elt.remaining) {
          this.totalLost = this.totalLost + elt.remaining;
        }
        this.total_quantity = this.total_quantity + elt.out;
      });
      this.TotalCash = this.total_amount + this.openCash - this.closeCash;
      if (this.TotalCash < 0) {
        this.displayAmount = -1 * this.TotalCash;
      } else {
        this.displayAmount = 0;
      }
      //- this.closeCash
      console.log(this.displayAmount);
      console.log(this.TotalCash);
    });
  }

  getProductItem(d) {
    this.resApi.getProductItemGroup2().subscribe((result) => {
      this.total_ristourne = 0;
      console.log(result);
      this.invoices.forEach((prod, index) => {
        let tab = result["items"].filter((elt) => {
          return elt._id == prod["productItemsId"];
        });
        if (tab.length) {
          this.getRistourne(tab[0], index, d);
        }
      });
    });
  }

  getRistourne(tab, i, b) {
    //console.log(tab);

    let d = JSON.parse(localStorage.getItem("d"));
    if (d) {
    } else {
      d = JSON.parse(localStorage.getItem("openCashDateObj"));
    }
    let storeId = d["storeId"];
    if (tab["ristourneTab"]) {
      let ristourneTab = tab["ristourneTab"].filter((elt) => {
        return elt.openCashDateId == d._id;
      });

      let ristourne = 0;
      ristourneTab.forEach((ris) => {
        if (ris["ristourne"] > 0) {
          ristourne = ristourne + ris["ristourne"];
        }
      });

      this.total_ristourne = this.total_ristourne + ristourne;
      this.invoices[i]["ristourne"] = ristourne;
    }
  }
}
