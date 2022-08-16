import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickCustomerPage } from './pick-customer.page';

describe('PickCustomerPage', () => {
  let component: PickCustomerPage;
  let fixture: ComponentFixture<PickCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
