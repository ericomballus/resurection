import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CategorieExpensePageRoutingModule } from './categorie-expense-routing.module';

import { CategorieExpensePage } from './categorie-expense.page';
import { TranslateModule } from '@ngx-translate/core';
import { ShareModule } from 'src/app/share.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CategorieExpensePageRoutingModule,
    TranslateModule.forChild(),
    ShareModule,
  ],
  declarations: [CategorieExpensePage],
})
export class CategorieExpensePageModule {}
