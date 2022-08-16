import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { AddEmployeeRetailerPage } from './add-employee-retailer.page';

const routes: Routes = [
  {
    path: '',
    component: AddEmployeeRetailerPage,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule,
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  exports: [RouterModule],
})
export class AddEmployeeRetailerPageRoutingModule {}
