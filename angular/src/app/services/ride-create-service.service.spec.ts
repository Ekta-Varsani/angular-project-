import { TestBed } from '@angular/core/testing';

import { RideCreateServiceService } from './ride-create-service.service';

describe('RideCreateServiceService', () => {
  let service: RideCreateServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideCreateServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
