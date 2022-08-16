import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { BeforeInventoryPageRoutingModule } from "./before-inventory-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { BeforeInventoryPage } from "./before-inventory.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BeforeInventoryPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [BeforeInventoryPage],
})
export class BeforeInventoryPageModule {}
