import { TestBed } from '@angular/core/testing';

import { RefuelingService } from './refueling.service';

describe('RefuelingService', () => {
  let service: RefuelingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefuelingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
