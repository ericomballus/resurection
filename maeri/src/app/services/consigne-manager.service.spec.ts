import { TestBed } from '@angular/core/testing';

import { ConsigneManagerService } from './consigne-manager.service';

describe('ConsigneManagerService', () => {
  let service: ConsigneManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsigneManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
