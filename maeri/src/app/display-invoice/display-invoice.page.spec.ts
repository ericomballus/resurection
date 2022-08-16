import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayInvoicePage } from './display-invoice.page';

describe('DisplayInvoicePage', () => {
  let component: DisplayInvoicePage;
  let fixture: ComponentFixture<DisplayInvoicePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayInvoicePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayInvoicePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
