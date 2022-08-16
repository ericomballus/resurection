import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConsigneDisplayPage } from './consigne-display.page';

const routes: Routes = [
  {
    path: '',
    component: ConsigneDisplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsigneDisplayPageRoutingModule {}
