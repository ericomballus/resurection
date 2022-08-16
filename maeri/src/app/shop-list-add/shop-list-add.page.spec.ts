import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShopListAddPage } from './shop-list-add.page';

describe('ShopListAddPage', () => {
  let component: ShopListAddPage;
  let fixture: ComponentFixture<ShopListAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopListAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShopListAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
