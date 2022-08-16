import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeRetailerInvoicesPage } from './employee-retailer-invoices.page';

describe('EmployeeRetailerInvoicesPage', () => {
  let component: EmployeeRetailerInvoicesPage;
  let fixture: ComponentFixture<EmployeeRetailerInvoicesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeRetailerInvoicesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeRetailerInvoicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
