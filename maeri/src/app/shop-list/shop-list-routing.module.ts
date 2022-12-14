import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ShopListPage } from './shop-list.page';

const routes: Routes = [
  {
    path: '',
    component: ShopListPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule.forChild()],
  exports: [RouterModule],
})
export class ShopListPageRoutingModule {}
