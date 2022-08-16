import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesViewUpdatePage } from './employees-view-update.page';

describe('EmployeesViewUpdatePage', () => {
  let component: EmployeesViewUpdatePage;
  let fixture: ComponentFixture<EmployeesViewUpdatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesViewUpdatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesViewUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
