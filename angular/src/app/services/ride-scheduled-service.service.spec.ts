import { TestBed } from '@angular/core/testing';

import { RideScheduledServiceService } from './ride-scheduled-service.service';

describe('RideScheduledServiceService', () => {
  let service: RideScheduledServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideScheduledServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
