import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufacturedPage } from './product-manufactured.page';

describe('ProductManufacturedPage', () => {
  let component: ProductManufacturedPage;
  let fixture: ComponentFixture<ProductManufacturedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductManufacturedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManufacturedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
