import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { SaverandomService } from 'src/app/services/saverandom.service';
import { Setting } from 'src/app/models/setting.models';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-zone-expedition',
  templateUrl: './zone-expedition.page.html',
  styleUrls: ['./zone-expedition.page.scss'],
})
export class ZoneExpeditionPage implements OnInit {
  setting: Setting;
  constructor(
    private adminService: AdminService,
    private random: SaverandomService,
    private modal: ModalController,
    private notifi: NotificationService
  ) {}

  ngOnInit() {
    this.setting = this.random.getSetting();
    console.log(this.setting);
  }

  register(form) {
    console.log(form.value);
    if (this.setting.zone && this.setting.zone.length) {
      let zone = this.setting.zone;
      zone = zone.filter((z) => z.name !== form.value.name);
      zone.push(form.value);
      this.setting.zone = zone;
    } else {
      let zone = [];
      zone.push(form.value);
      this.setting.zone = zone;
    }
  }
  closeModal() {
    this.modal.dismiss();
  }
  save() {
    this.notifi.presentLoading();
    this.adminService.updateCompanySetting(this.setting).subscribe((data) => {
      console.log(data);
      this.notifi.dismissLoading();
      this.notifi.presentToast('enregistré avec succés', 'success');
      this.closeModal();
    });
  }

  RemoveZone(data) {
    if (this.setting.zone && this.setting.zone.length) {
      let zone = this.setting.zone;
      zone = zone.filter((z) => z.name !== data.name);
      this.setting.zone = zone;
    }
  }
}
