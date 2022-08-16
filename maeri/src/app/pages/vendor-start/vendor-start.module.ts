import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { VendorStartPageRoutingModule } from "./vendor-start-routing.module";

import { VendorStartPage } from "./vendor-start.page";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VendorStartPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [VendorStartPage],
})
export class VendorStartPageModule {}
