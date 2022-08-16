import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddCocktailPageRoutingModule } from './add-cocktail-routing.module';

import { AddCocktailPage } from './add-cocktail.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddCocktailPageRoutingModule,
    TranslateModule.forChild(),
  ],
  declarations: [AddCocktailPage],
})
export class AddCocktailPageModule {}
