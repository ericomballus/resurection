import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { ShopListAddPage } from './shop-list-add.page';

const routes: Routes = [
  {
    path: '',
    component: ShopListAddPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), TranslateModule.forChild()],
  exports: [RouterModule],
})
export class ShopListAddPageRoutingModule {}
