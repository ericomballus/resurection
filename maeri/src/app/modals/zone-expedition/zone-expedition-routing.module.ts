import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZoneExpeditionPage } from './zone-expedition.page';

const routes: Routes = [
  {
    path: '',
    component: ZoneExpeditionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ZoneExpeditionPageRoutingModule {}
