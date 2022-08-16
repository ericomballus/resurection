import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FcHomePage } from './fc-home.page';

const routes: Routes = [
  {
    path: '',
    component: FcHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FcHomePageRoutingModule {}
