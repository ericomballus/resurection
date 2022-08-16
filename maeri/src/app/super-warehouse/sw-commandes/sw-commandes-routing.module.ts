import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwCommandesPage } from './sw-commandes.page';

const routes: Routes = [
  {
    path: '',
    component: SwCommandesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwCommandesPageRoutingModule {}
