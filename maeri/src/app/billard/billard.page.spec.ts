import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillardPage } from './billard.page';

describe('BillardPage', () => {
  let component: BillardPage;
  let fixture: ComponentFixture<BillardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillardPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
