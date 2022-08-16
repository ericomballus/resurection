import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePaiePage } from './invoice-paie.page';

describe('InvoicePaiePage', () => {
  let component: InvoicePaiePage;
  let fixture: ComponentFixture<InvoicePaiePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvoicePaiePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvoicePaiePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
