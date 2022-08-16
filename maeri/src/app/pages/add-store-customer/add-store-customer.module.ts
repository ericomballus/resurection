import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddStoreCustomerPageRoutingModule } from "./add-store-customer-routing.module";

import { AddStoreCustomerPage } from "./add-store-customer.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddStoreCustomerPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AddStoreCustomerPage],
})
export class AddStoreCustomerPageModule {}
