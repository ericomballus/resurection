import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufacturedBuyPage } from './product-manufactured-buy.page';

describe('ProductManufacturedBuyPage', () => {
  let component: ProductManufacturedBuyPage;
  let fixture: ComponentFixture<ProductManufacturedBuyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductManufacturedBuyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManufacturedBuyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
