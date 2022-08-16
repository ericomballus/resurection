import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RetailerModalPage } from './retailer-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RetailerModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RetailerModalPageRoutingModule {}
