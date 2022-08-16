import { TestBed } from '@angular/core/testing';

import { GetStoreNameService } from './get-store-name.service';

describe('GetStoreNameService', () => {
  let service: GetStoreNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetStoreNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
