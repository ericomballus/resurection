import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeExpensePageRoutingModule } from './home-expense-routing.module';

import { HomeExpensePage } from './home-expense.page';
import { ShareModule } from 'src/app/share.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeExpensePageRoutingModule,
    ShareModule,
    NgbModule,
  ],
  declarations: [HomeExpensePage],
})
export class HomeExpensePageModule {}
