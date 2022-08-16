import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetailerModalPage } from './retailer-modal.page';

describe('RetailerModalPage', () => {
  let component: RetailerModalPage;
  let fixture: ComponentFixture<RetailerModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetailerModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
