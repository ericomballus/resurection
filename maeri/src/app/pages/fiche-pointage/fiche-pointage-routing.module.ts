import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FichePointagePage } from './fiche-pointage.page';

const routes: Routes = [
  {
    path: '',
    component: FichePointagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FichePointagePageRoutingModule {}
