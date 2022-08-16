import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { RestApiService } from '../../services/rest-api.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Invoice } from 'src/app/models/invoice';
import { TranchePaiement } from 'src/app/models/tranche';
import { from, interval, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-display-sale',
  templateUrl: './display-sale.page.html',
  styleUrls: ['./display-sale.page.scss'],
})
export class DisplaySalePage implements OnInit {
  invoices: any;
  isLoading = false;
  total_amount: number = 0;
  total_glace: number = 0;
  total_nonglace: number = 0;
  total_ristourne: number = 0;
  total_quantity: number = 0;
  openCashDate: any = null;
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
  // storeId: any;
  d: any;
  manageStockWithService = false;
  onvarevenirdessus = false;
  TotalCash2 = 0;
  TotalCash3 = 0;
  invoiceNotPaie = 0;
  invoiceCancel = 0;
  cancelTab: Invoice[] = [];
  reduction = 0;
  storeId = null;
  constructor(
    public loadingController: LoadingController,
    public adminService: AdminService,
    public route: Router,
    public resApi: RestApiService,
    private notifi: NotificationService,
    public saveRandom: SaverandomService
  ) {
    this.getSetting();
    this.getInventory();
    //  this.getInvoiceNotSale();
  }

  ngOnInit() {
    localStorage.removeItem('firstTime');

    setTimeout(() => {
      this.getBill();
      this.getInvoiceNotSale();
      this.getInvoiceSale();
      this.getAllInvoiceCancel();
    }, 1000);
    if (this.saveRandom.getExpensiveAndCash()) {
      this.openCashDate = this.saveRandom.getExpensiveAndCash();
      if (!this.openCashDate.expense) {
        this.openCashDate.expense = 0;
      }
      if (!this.openCashDate.recipe) {
        this.openCashDate.recipe = 0;
      }
    }
  }
  getSetting() {
    let setting = JSON.parse(localStorage.getItem('setting'));

    if (setting.length) {
      this.manageStockWithService = setting[0]['manageStockWithService'];
    } else {
      if (setting['manageStockWithService']) {
        //console.log(setting["manageStockWithService"]);

        this.manageStockWithService = setting['manageStockWithService'];
      }
    }
  }

  getInvoiceNotSale() {
    // localStorage.setItem("queryDate", JSON.stringify(d))
    this.TotalCash2 = 0;
    this.TotalCash3 = 0;
    this.invoiceNotPaie = 0;
    this.invoiceCancel = 0;
    let d = JSON.parse(localStorage.getItem('queryDate'));
    this.adminService.getInvoiceNotPaieAdmin2(d._id).subscribe((res) => {
      let docs: Invoice[] = res['docs'];
      //  console.log('not paie and cancel', docs);

      docs = docs.sort((a, b) => {
        if (a.numFacture < b.numFacture) {
          return -1;
        }
        return 0;
      });
      docs.forEach((invoice) => {
        if (!invoice.invoiceCancel && invoice.openCashDateId == d._id) {
          this.invoiceNotPaie = this.invoiceNotPaie + 1;
          /*invoice.trancheList.forEach((tranche: TranchePaiement) => {
            this.TotalCash2 = this.TotalCash2 + tranche.montant;
          });*/
          if (invoice.commande && invoice.commande['montantReduction']) {
            this.TotalCash2 =
              this.TotalCash2 + invoice.commande['montantReduction'];
            // this.reduction =
            // this.reduction + invoice.commande['montantReduction'];
          } else {
            this.TotalCash2 =
              this.TotalCash2 + invoice.commande['cartdetails']['totalPrice'];
          }
          this.cancelTab.push(invoice);
        }
        if (invoice.invoiceCancel) {
          this.invoiceCancel = this.invoiceCancel + 1;
          invoice.trancheList.forEach((tranche: TranchePaiement) => {
            this.TotalCash3 = this.TotalCash3 + tranche.montant;
          });
        }
      });
    });
  }

  getBill() {
    let totale = 0;
    let montant = 0;
    this.adminService.managerGetBillShop().subscribe((result) => {
      result['docs'].forEach((doc) => {
        if (doc.commande.montantReduction) {
          montant = montant + doc.commande.montantReduction;
          doc.montantReduction = doc.commande.montantReduction;
        } else {
          montant = montant + doc.montant;
        }

        totale = totale + doc.commande['cartdetails']['totalPrice'];
        doc['commandes'].forEach((com) => {
          if (com && com['montantReduction']) {
            // console.log('this is doc ==>', doc);
            this.reduction =
              this.reduction +
              (com['cartdetails']['totalPrice'] - com['montantReduction']);
          }
        });
      });
    });
  }

  getAllInvoiceCancel() {
    let d = JSON.parse(localStorage.getItem('queryDate'));
    this.adminService.getInvoiceCancel(d._id).subscribe((res) => {
      console.log('not paie and cancel ====>', res);
    });
  }

  getInvoiceSale() {
    // localStorage.setItem("queryDate", JSON.stringify(d))
    let reduction = 0;
    this.TotalCash2 = 0;
    // this.TotalCash3 = 0;
    this.invoiceNotPaie = 0;
    this.invoiceCancel = 0;
    let d = JSON.parse(localStorage.getItem('queryDate'));
    let totale = 0;
    this.adminService.getInvoicePaieAdmin2(d._id).subscribe((res) => {
      let docs: Invoice[] = res['docs'];

      docs = docs.sort((a, b) => {
        if (a.numFacture < b.numFacture) {
          return -1;
        }
        return 0;
      });
      console.log(' paie invoice here', docs);
      docs.forEach((doc) => {
        totale = totale + doc.commande['cartdetails']['totalPrice'];
        doc['commandes'].forEach((com) => {
          if (com && com['montantReduction']) {
            // console.log('this is doc ==>', doc); 100800
            reduction =
              reduction +
              (com['cartdetails']['totalPrice'] - com['montantReduction']);
          }
        });
      });
    });
  }
  goToStartPage() {
    // console.log("hello");
    this.route.navigateByUrl('sale-per-day');
  }
  getInventory() {
    if (!this.manageStockWithService) {
      this.adminService.getAdminInventory().subscribe((data) => {
        //  console.log('de retour ici', data['docs']);

        data['docs'] = data['docs'].filter((inv) => {
          return inv['out'] > 0;
        });

        this.openCash = 0;
        data['docs'].forEach((prod) => {
          prod['name'] = prod['name'].toUpperCase();
        });
        this.invoices = data['docs'].sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );
        this.openCash = data['cash']['cashFund'];
        this.closeCash = data['cash']['closing_cash'];

        this.invoices.forEach((elt) => {
          if (elt.out) {
            //  this.total_amount = this.total_amount + elt.totalSalesAmount;
            this.total_amount = this.total_amount + elt.out * elt.pvente;
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

        localStorage.removeItem('orherIdDay');
        let d = JSON.parse(localStorage.getItem('d'))['_id'];
        this.getProductItem(d);

        //- this.closeCash
      });
    } else {
      if (JSON.parse(localStorage.getItem('open'))) {
        let d = JSON.parse(localStorage.getItem('findThis'));

        this.makeInventaireRandom(d);
        localStorage.removeItem('open');
      } else {
        this.notifi.presentLoading();
        this.adminService.getAdminInventory().subscribe(
          (data) => {
            console.log('avec service', data);
            this.notifi.dismissLoading();
            if (data['docs'] && data['docs'].length == 0) {
              this.notifi.dismissLoading();
              console.log('avec service');
              let d = JSON.parse(localStorage.getItem('queryDate'));

              if (d) {
                this.notifi.dismissLoading();
                this.makeInventaireRandom(d);
              }

              return;
            } else {
              this.notifi.dismissLoading();
              let tab = [];
              //  tab=  data["docs"]
              tab = data['docs'].filter((inv) => {
                return inv['out'] > 0;
              });
              tab.forEach((prod) => {
                prod['name'] = prod['name'].toUpperCase();
              });
              this.openCash = 0;
              // this.invoices = data["docs"];
              this.openCash = data['cash']['cashFund'];
              this.closeCash = data['cash']['closing_cash'];

              this.invoices = tab.sort((a, b) =>
                a.name > b.name ? 1 : b.name > a.name ? -1 : 0
              );

              if (JSON.parse(localStorage.getItem('cashClose'))) {
                /* this.closeCash = parseInt(
                JSON.parse(localStorage.getItem("cashClose"))
              ); */
              } else {
                this.closeCash = data['cash']['closing_cash'];
              }

              //  this.dismissLoading();
              this.invoices.forEach((elt) => {
                if (elt.totalSalesAmount) {
                  this.total_amount = this.total_amount + elt.totalSalesAmount;
                }

                if (elt.ristourneGenerate) {
                  this.total_ristourne =
                    this.total_ristourne + elt.ristourneGenerate;
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
                  this.totalEx = this.totalEx + elt.more;
                }
                if (elt.more) {
                  this.totalLost = this.totalLost + elt.more;
                }
                this.total_quantity = this.total_quantity + elt.out;
              });
              this.TotalCash =
                this.total_amount + this.openCash - this.closeCash;
              if (this.TotalCash < 0) {
                this.displayAmount = -1 * this.TotalCash;
              } else {
                this.displayAmount = 0;
              }
              //- this.closeCash

              this.notifi.dismissLoading();
              this.getProductItem(this.d);
            }
          },
          (err) => {
            this.notifi.dismissLoading();
            this.notifi.presentToast('une erreur est survenue', 'danger');
          }
        );
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
    console.log('make random here ===>', d);

    this.notifi.presentLoading();
    this.adminService.getAdminInventoryRandom(d).subscribe(
      (data) => {
        localStorage.removeItem('findThis');
        console.log(data['docs']);
        this.notifi.dismissLoading();
        if (data['docs'].length == 0) {
          this.notifi.presentToast(
            'pas de données disponibles pour le moment',
            'primary'
          );
        }
        this.total_amount = 0;
        data['docs'].forEach((prod) => {
          prod['name'] = prod['name'].toUpperCase();
        });
        this.openCash = d.cashFund;
        this.closeCash = 0;
        data['docs'] = data['docs'].filter((inv) => {
          return inv['out'] > 0;
        });
        this.invoices = data['docs'].sort((a, b) =>
          a.name > b.name ? 1 : b.name > a.name ? -1 : 0
        );

        this.invoices.forEach((elt) => {
          console.log(elt);

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
        this.notifi.dismissLoading();
      },
      (err) => {
        this.notifi.dismissLoading();
      }
    );
  }

  getProductItem(d) {
    this.resApi.getProductItemGroup2().subscribe((result) => {
      this.total_ristourne = 0;
      // console.log(result);
      if (result && result['items'].length) {
        this.invoices.forEach((prod, index) => {
          let tab = result['items'].filter((elt) => {
            return elt._id == prod['productItemsId'];
          });
          if (tab.length) {
            this.getRistourne(tab[0], index, d);
          }
        });
      }
    });
  }

  getRistourne(tab, i, b) {
    //console.log(tab);

    let d = JSON.parse(localStorage.getItem('d'));
    if (d) {
    } else {
      d = JSON.parse(localStorage.getItem('openCashDateObj'));
    }
    let storeId = d['storeId'];
    if (tab['ristourneTab']) {
      let ristourneTab = tab['ristourneTab'].filter((elt) => {
        return elt.openCashDateId == d._id;
      });

      let ristourne = 0;
      ristourneTab.forEach((ris) => {
        if (ris['ristourne'] > 0) {
          ristourne = ristourne + ris['ristourne'];
        }
      });

      this.total_ristourne = this.total_ristourne + ristourne;
      this.invoices[i]['ristourne'] = ristourne;
    }
  }
  displayNotPaie() {
    this.saveRandom.setCustomerInvoices(this.cancelTab);
    this.route.navigateByUrl('invoice-unpaid');
    console.log(this.cancelTab);
  }
}
