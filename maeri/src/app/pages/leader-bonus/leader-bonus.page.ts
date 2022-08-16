import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SaverandomService } from 'src/app/services/saverandom.service';

@Component({
  selector: 'app-leader-bonus',
  templateUrl: './leader-bonus.page.html',
  styleUrls: ['./leader-bonus.page.scss'],
})
export class LeaderBonusPage implements OnInit {
  bonusTab = [];
  constructor(private saveRandom: SaverandomService, private router: Router) {}

  ngOnInit() {
    this.bonusTab = this.saveRandom.getCustomerInvoices();
  }
}
