import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RetailerDisplayOrderProposalPage } from './retailer-display-order-proposal.page';

describe('RetailerDisplayOrderProposalPage', () => {
  let component: RetailerDisplayOrderProposalPage;
  let fixture: ComponentFixture<RetailerDisplayOrderProposalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailerDisplayOrderProposalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RetailerDisplayOrderProposalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
