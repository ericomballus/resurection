import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductResourceItemPage } from './product-resource-item.page';

describe('ProductResourceItemPage', () => {
  let component: ProductResourceItemPage;
  let fixture: ComponentFixture<ProductResourceItemPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductResourceItemPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductResourceItemPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
