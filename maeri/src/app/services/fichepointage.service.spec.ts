import { TestBed } from '@angular/core/testing';

import { FichepointageService } from './fichepointage.service';

describe('FichepointageService', () => {
  let service: FichepointageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichepointageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
