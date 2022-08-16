import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VendorOrderProposalPage } from './vendor-order-proposal.page';

describe('VendorOrderProposalPage', () => {
  let component: VendorOrderProposalPage;
  let fixture: ComponentFixture<VendorOrderProposalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorOrderProposalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VendorOrderProposalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
