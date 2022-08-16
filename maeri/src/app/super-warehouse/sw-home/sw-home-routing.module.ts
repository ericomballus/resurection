import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwHomePage } from './sw-home.page';

const routes: Routes = [
  {
    path: '',
    component: SwHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwHomePageRoutingModule {}
