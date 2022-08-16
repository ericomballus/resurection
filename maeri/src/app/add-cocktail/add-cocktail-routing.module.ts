import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddCocktailPage } from './add-cocktail.page';

const routes: Routes = [
  {
    path: '',
    component: AddCocktailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCocktailPageRoutingModule {}
