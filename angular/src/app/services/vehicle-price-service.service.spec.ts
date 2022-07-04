import { TestBed } from '@angular/core/testing';

import { VehiclePriceServiceService } from './vehicle-price-service.service';

describe('VehiclePriceServiceService', () => {
  let service: VehiclePriceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehiclePriceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
