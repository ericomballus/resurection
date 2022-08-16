import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouteemployePage } from './ajouteemploye.page';

describe('AjouteemployePage', () => {
  let component: AjouteemployePage;
  let fixture: ComponentFixture<AjouteemployePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AjouteemployePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouteemployePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
