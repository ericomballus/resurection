import { TestBed } from '@angular/core/testing';

import { SelectvendorService } from './selectvendor.service';

describe('SelectvendorService', () => {
  let service: SelectvendorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectvendorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
