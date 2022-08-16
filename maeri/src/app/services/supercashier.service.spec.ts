import { TestBed } from '@angular/core/testing';

import { SupercashierService } from './supercashier.service';

describe('SupercashierService', () => {
  let service: SupercashierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupercashierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
