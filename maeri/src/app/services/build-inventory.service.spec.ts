import { TestBed } from '@angular/core/testing';

import { BuildInventoryService } from './build-inventory.service';

describe('BuildInventoryService', () => {
  let service: BuildInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BuildInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
