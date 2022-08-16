import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintConfigPage } from './print-config.page';

describe('PrintConfigPage', () => {
  let component: PrintConfigPage;
  let fixture: ComponentFixture<PrintConfigPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintConfigPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintConfigPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
