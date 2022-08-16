import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BuildDisplayInventoryPage } from './build-display-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: BuildDisplayInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BuildDisplayInventoryPageRoutingModule {}
