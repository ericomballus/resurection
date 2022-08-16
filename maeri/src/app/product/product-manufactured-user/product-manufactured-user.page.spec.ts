import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductManufacturedUserPage } from './product-manufactured-user.page';

describe('ProductManufacturedUserPage', () => {
  let component: ProductManufacturedUserPage;
  let fixture: ComponentFixture<ProductManufacturedUserPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductManufacturedUserPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductManufacturedUserPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
