import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBuyPage } from './product-buy.page';

describe('ProductBuyPage', () => {
  let component: ProductBuyPage;
  let fixture: ComponentFixture<ProductBuyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBuyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBuyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
