import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwDisplayCommandePage } from './sw-display-commande.page';

const routes: Routes = [
  {
    path: '',
    component: SwDisplayCommandePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwDisplayCommandePageRoutingModule {}
