import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePerDayPage } from './sale-per-day.page';

describe('SalePerDayPage', () => {
  let component: SalePerDayPage;
  let fixture: ComponentFixture<SalePerDayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalePerDayPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalePerDayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
