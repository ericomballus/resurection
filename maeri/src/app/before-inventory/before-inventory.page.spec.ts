import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BeforeInventoryPage } from './before-inventory.page';

describe('BeforeInventoryPage', () => {
  let component: BeforeInventoryPage;
  let fixture: ComponentFixture<BeforeInventoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeforeInventoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BeforeInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
