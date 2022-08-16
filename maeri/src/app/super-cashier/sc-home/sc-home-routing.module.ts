import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScHomePage } from './sc-home.page';

const routes: Routes = [
  {
    path: '',
    component: ScHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScHomePageRoutingModule {}
