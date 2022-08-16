import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-mypop',
  templateUrl: './mypop.component.html',
  styleUrls: ['./mypop.component.scss'],
})
export class MypopComponent implements OnInit {
  constructor(private popover: PopoverController) {}

  ngOnInit() {}
}
