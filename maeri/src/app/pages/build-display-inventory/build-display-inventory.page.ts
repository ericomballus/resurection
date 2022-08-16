import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-build-display-inventory',
  templateUrl: './build-display-inventory.page.html',
  styleUrls: ['./build-display-inventory.page.scss'],
})
export class BuildDisplayInventoryPage implements OnInit {
  inventory = [];
  totalProduct = 0;
  totalOut = 0;
  totalRest = 0;
  totalStart = 0;
  totalMove = 0;
  cashClose = 0;
  totalSale = 0;
  constructor(public inventoryService: InventoryService) {}

  ngOnInit() {
    // this.inventory = this.inventoryService.getInventoryList()["docs"];
    this.inventory = this.inventoryService.getInventoryList();
    this.cashClose = this.inventoryService.getCash();
    this.inventory = this.inventory;

    this.inventory.forEach((inv) => {
      if (inv.quantityOUT > 0) {
        this.totalSale =
          this.totalSale + inv.quantityOUT * inv.prod.sellingPrice;
      }

      // console.log(prod);
      /* this.totalStart = this.totalStart + prod["itemsSold"][0]["oldstock"];
      this.totalProduct = this.totalProduct + prod["quantity"];
      this.totalOut = this.totalOut + prod["quantityOut"];
      this.totalRest =
        this.totalRest + (prod["quantity"] - prod["quantityOut"]);
      this.totalMove = this.totalMove + prod["itemsSold"].length; */
    });
  }
}
