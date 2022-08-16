import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminDisplayCustumersPage } from './admin-display-custumers.page';

describe('AdminDisplayCustumersPage', () => {
  let component: AdminDisplayCustumersPage;
  let fixture: ComponentFixture<AdminDisplayCustumersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminDisplayCustumersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDisplayCustumersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
