import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FicheDetailsPage } from './fiche-details.page';

const routes: Routes = [
  {
    path: '',
    component: FicheDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FicheDetailsPageRoutingModule {}
