import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductItemListPage } from './product-item-list.page';

describe('ProductItemListPage', () => {
  let component: ProductItemListPage;
  let fixture: ComponentFixture<ProductItemListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductItemListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductItemListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
