import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CacheImageComponent } from './cache-image.component';

describe('CacheImageComponent', () => {
  let component: CacheImageComponent;
  let fixture: ComponentFixture<CacheImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheImageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CacheImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
