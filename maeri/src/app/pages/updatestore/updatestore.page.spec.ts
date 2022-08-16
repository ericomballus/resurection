import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpdatestorePage } from './updatestore.page';

describe('UpdatestorePage', () => {
  let component: UpdatestorePage;
  let fixture: ComponentFixture<UpdatestorePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatestorePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdatestorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
