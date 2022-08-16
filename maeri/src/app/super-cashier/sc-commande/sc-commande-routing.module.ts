import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScCommandePage } from './sc-commande.page';
import { TranslateModule } from '@ngx-translate/core';
const routes: Routes = [
  {
    path: '',
    component: ScCommandePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule.forChild()],
  exports: [RouterModule],
})
export class ScCommandePageRoutingModule {}
