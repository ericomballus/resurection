import { TestBed } from '@angular/core/testing';

import { ManageCartService } from './manage-cart.service';

describe('ManageCartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageCartService = TestBed.get(ManageCartService);
    expect(service).toBeTruthy();
  });
});
