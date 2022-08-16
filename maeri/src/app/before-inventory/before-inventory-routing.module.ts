import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeforeInventoryPage } from './before-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: BeforeInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeforeInventoryPageRoutingModule {}
