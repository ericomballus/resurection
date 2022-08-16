import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Admin } from 'src/app/models/admin.model';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { CreateContratPage } from '../create-contrat/create-contrat.page';
import { ContratService } from 'src/app/services/contrat.service';
import { Socket } from 'ngx-socket-io';
import { Contrat } from 'src/app/models/contrat.model';

@Component({
  selector: 'app-list-contrat',
  templateUrl: './list-contrat.page.html',
  styleUrls: ['./list-contrat.page.scss'],
})
export class ListContratPage implements OnInit {
  contratList: Contrat[] = [];
  constructor(
    private randomStorage: SaverandomService,
    private modal: ModalController,
    public contratService: ContratService,
    public router: Router
  ) {}

  ngOnInit() {
    this.getContrat();
  }
  async createdContrat() {
    const modal = await this.modal.create({
      component: CreateContratPage,
      componentProps: {},
    });
    modal.onDidDismiss().then((data) => {
      console.log(data);
    });
    return await modal.present();
  }
  getContrat() {
    let adminId = localStorage.getItem('adminId');
    this.contratService.getContrat(adminId).subscribe((docs: Contrat[]) => {
      console.log('contrat', docs);
      this.contratList = docs;
    });
  }
  displayDetails(contrat: Contrat) {
    this.randomStorage.setUserBill(contrat);
    let admin = JSON.parse(localStorage.getItem('user'));
    if (admin && admin[0] && admin[0].company) {
      this.randomStorage.setUserAdmin(admin[0]);
    }
    this.router.navigateByUrl('contrat-details');
  }
}
