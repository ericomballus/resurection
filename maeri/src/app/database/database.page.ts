import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AdminService } from '../services/admin.service';
import { SaverandomService } from '../services/saverandom.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.page.html',
  styleUrls: ['./database.page.scss'],
})
export class DatabasePage implements OnInit {
  database: any;
  adminId: any;
  constructor(
    private modalController: ModalController,
    public adminService: AdminService,
    private router: Router,
    private savaRandom: SaverandomService
  ) {
    //  this.database = navParams.get("db");
    this.adminId = localStorage.getItem('adminId');
    this.getDabaseList();
  }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss('erico');
  }
  getCollectionNames(db) {
    this.adminService.customersDbCollectionsName(db.name).subscribe((data) => {
      console.log(data);
      this.savaRandom.setDbName(db.name);
      this.savaRandom.setCollectionList(data);
      this.router.navigateByUrl('admin-display-collections');
    });
  }

  getDabaseList() {
    this.adminService.customersDB(this.adminId).subscribe((data) => {
      console.log(data);
      this.database = data;
      // this.Godatabase(data);
    });
  }
}
