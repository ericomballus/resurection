import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FicheListPage } from './fiche-list.page';

const routes: Routes = [
  {
    path: '',
    component: FicheListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FicheListPageRoutingModule {}
