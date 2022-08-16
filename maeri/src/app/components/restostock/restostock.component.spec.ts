import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RestostockComponent } from './restostock.component';

describe('RestostockComponent', () => {
  let component: RestostockComponent;
  let fixture: ComponentFixture<RestostockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RestostockComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RestostockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
