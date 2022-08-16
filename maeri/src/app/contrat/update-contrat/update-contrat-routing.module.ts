import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateContratPage } from './update-contrat.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateContratPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateContratPageRoutingModule {}
