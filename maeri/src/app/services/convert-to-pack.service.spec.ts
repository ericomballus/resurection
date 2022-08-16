import { TestBed } from '@angular/core/testing';

import { ConvertToPackService } from './convert-to-pack.service';

describe('ConvertToPackService', () => {
  let service: ConvertToPackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConvertToPackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
