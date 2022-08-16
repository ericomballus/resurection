import { TestBed } from '@angular/core/testing';

import { SuperwarehouseService } from './superwarehouse.service';

describe('SuperwarehouseService', () => {
  let service: SuperwarehouseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuperwarehouseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
