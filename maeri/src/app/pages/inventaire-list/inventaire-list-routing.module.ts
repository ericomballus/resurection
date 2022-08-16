import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventaireListPage } from './inventaire-list.page';

const routes: Routes = [
  {
    path: '',
    component: InventaireListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventaireListPageRoutingModule {}
