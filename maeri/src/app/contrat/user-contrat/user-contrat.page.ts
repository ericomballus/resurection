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
  selector: 'app-user-contrat',
  templateUrl: './user-contrat.page.html',
  styleUrls: ['./user-contrat.page.scss'],
})
export class UserContratPage implements OnInit {
  admin: Admin;
  contratList: Contrat[] = [];
  constructor(
    private randomStorage: SaverandomService,
    private modal: ModalController,
    public contratService: ContratService,
    private socket: Socket,
    private router: Router
  ) {}

  ngOnInit() {
    this.admin = this.randomStorage.getUserAdmin();
    console.log(this.admin.company);
    this.getContrat();
    this.webServerSocket();
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
    this.contratService
      .getContrat(this.admin._id)
      .subscribe((docs: Contrat[]) => {
        console.log('contrat', docs);
        this.contratList = docs;
      });
  }
  webServerSocket() {
    console.log('hello hello');
    this.socket.connect();

    this.socket.emit('set-name', name);

    this.socket.fromEvent('contrat').subscribe((data) => {
      console.log('contrat ', data);
    });

    this.socket.fromEvent('update_contrat').subscribe((data: Contrat) => {
      // this.contratList.unshift(data);
      let index = this.contratList.findIndex((c) => c._id == data._id);
      if (index >= 0) {
        this.contratList.splice(index, 1, data);
      }
    });

    this.socket.fromEvent('requestIn').subscribe((data) => {
      console.log('Incomming', data);
    });
  }

  updateContrat(contrat) {
    console.log(contrat);
    this.randomStorage.setContrat(contrat);
    this.router.navigateByUrl('update-contrat');
  }
  displayDetails(contrat: Contrat) {
    this.randomStorage.setUserBill(contrat);
    this.router.navigateByUrl('contrat-details');
  }
}
