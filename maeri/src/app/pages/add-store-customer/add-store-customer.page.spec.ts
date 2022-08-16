import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddStoreCustomerPage } from './add-store-customer.page';

describe('AddStoreCustomerPage', () => {
  let component: AddStoreCustomerPage;
  let fixture: ComponentFixture<AddStoreCustomerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStoreCustomerPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddStoreCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
