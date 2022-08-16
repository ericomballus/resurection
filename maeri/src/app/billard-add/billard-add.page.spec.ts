import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BillardAddPage } from './billard-add.page';

describe('BillardAddPage', () => {
  let component: BillardAddPage;
  let fixture: ComponentFixture<BillardAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillardAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillardAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
