import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BeforePrintPage } from './before-print.page';

const routes: Routes = [
  {
    path: '',
    component: BeforePrintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BeforePrintPageRoutingModule {}
