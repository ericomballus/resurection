import { TestBed } from '@angular/core/testing';

import { ManagesocketService } from './managesocket.service';

describe('ManagesocketService', () => {
  let service: ManagesocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManagesocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
