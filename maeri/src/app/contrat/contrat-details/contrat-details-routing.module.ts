import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContratDetailsPage } from './contrat-details.page';

const routes: Routes = [
  {
    path: '',
    component: ContratDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratDetailsPageRoutingModule {}
