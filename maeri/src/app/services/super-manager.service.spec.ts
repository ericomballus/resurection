import { TestBed } from '@angular/core/testing';

import { SuperManagerService } from './super-manager.service';

describe('SuperManagerService', () => {
  let service: SuperManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
