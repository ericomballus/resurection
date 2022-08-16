import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SaHomePage } from './sa-home.page';

const routes: Routes = [
  {
    path: '',
    component: SaHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaHomePageRoutingModule {}
