import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DisplaySalePage } from './display-sale.page';

describe('DisplaySalePage', () => {
  let component: DisplaySalePage;
  let fixture: ComponentFixture<DisplaySalePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySalePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DisplaySalePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
