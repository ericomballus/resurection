import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { WharehousePage } from "./wharehouse.page";
import { TranslateModule } from "@ngx-translate/core";
import { ShareModule } from "../share.module";
import { Shared2Module } from "../shared2/shared2.module";
const routes: Routes = [
  {
    path: "",
    component: WharehousePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    ShareModule,
    Shared2Module,
  ],
  declarations: [WharehousePage],
})
export class WharehousePageModule {}
