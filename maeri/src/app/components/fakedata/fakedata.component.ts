import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fakedata',
  templateUrl: './fakedata.component.html',
  styleUrls: ['./fakedata.component.scss'],
})
export class FakedataComponent implements OnInit {
  @Input() spinner = true;
  constructor() {}

  ngOnInit() {}
}
