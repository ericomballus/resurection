import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuildDisplayInventoryPage } from './build-display-inventory.page';

describe('BuildDisplayInventoryPage', () => {
  let component: BuildDisplayInventoryPage;
  let fixture: ComponentFixture<BuildDisplayInventoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildDisplayInventoryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuildDisplayInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
