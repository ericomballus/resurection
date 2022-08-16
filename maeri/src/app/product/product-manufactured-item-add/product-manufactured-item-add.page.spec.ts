import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufacturedItemAddPage } from './product-manufactured-item-add.page';

describe('ProductManufacturedItemAddPage', () => {
  let component: ProductManufacturedItemAddPage;
  let fixture: ComponentFixture<ProductManufacturedItemAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductManufacturedItemAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManufacturedItemAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
