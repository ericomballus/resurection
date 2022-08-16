import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateContratPage } from './create-contrat.page';

const routes: Routes = [
  {
    path: '',
    component: CreateContratPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateContratPageRoutingModule {}
