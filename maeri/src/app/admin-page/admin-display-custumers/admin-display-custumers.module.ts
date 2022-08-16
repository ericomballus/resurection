import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AdminDisplayCustumersPageRoutingModule } from "./admin-display-custumers-routing.module";

import { AdminDisplayCustumersPage } from "./admin-display-custumers.page";
import { Shared2Module } from "src/app/shared2/shared2.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminDisplayCustumersPageRoutingModule,
    Shared2Module,
  ],
  declarations: [AdminDisplayCustumersPage],
})
export class AdminDisplayCustumersPageModule {}
