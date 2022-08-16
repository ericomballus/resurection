import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VendorStartPage } from './vendor-start.page';

const routes: Routes = [
  {
    path: '',
    component: VendorStartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VendorStartPageRoutingModule {}
