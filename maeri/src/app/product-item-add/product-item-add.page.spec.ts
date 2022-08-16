import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemAddPage } from './product-item-add.page';

describe('ProductItemAddPage', () => {
  let component: ProductItemAddPage;
  let fixture: ComponentFixture<ProductItemAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductItemAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
