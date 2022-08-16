import { TestBed } from '@angular/core/testing';

import { ManagerInventoryService } from './manager-inventory.service';

describe('ManagerInventoryService', () => {
  let service: ManagerInventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagerInventoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
