import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpenseService } from 'src/app/services/expense.service';
import { NotificationService } from 'src/app/services/notification.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-categorie-expense',
  templateUrl: './categorie-expense.page.html',
  styleUrls: ['./categorie-expense.page.scss'],
})
export class CategorieExpensePage implements OnInit {
  @ViewChild('form', { read: NgForm }) formulaire: NgForm;
  categories: any[] = [];
  response = false;
  constructor(
    private expenseService: ExpenseService,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.getCategorie();
  }

  getCategorie() {
    this.expenseService.getExpenseCategories().subscribe((docs: any) => {
      this.response = true;
      this.categories = docs;
    });
  }

  register(form) {
    console.log(form);

    this.notifi.presentLoading();

    this.expenseService.addExpenseCategories(form.value).subscribe(
      (res) => {
        this.formulaire.reset();
        this.notifi.dismissLoading();
        this.notifi.presentToast('enregistré avec success !', 'success');
        this.categories.unshift(res);
      },
      (err) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('une erreur est survenue !', 'danger');
      }
    );
  }

  deleteCategories(category) {
    this.expenseService
      .deleteExpenseCategories(category._id)
      .subscribe((res) => {
        this.notifi.dismissLoading();
        this.notifi.presentToast('supprimé avec success !', 'danger');
        this.categories = this.categories.filter(
          (elt) => elt._id !== category._id
        );
      });
  }
}
