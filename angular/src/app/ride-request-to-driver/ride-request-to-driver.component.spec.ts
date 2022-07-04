import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRequestToDriverComponent } from './ride-request-to-driver.component';

describe('RideRequestToDriverComponent', () => {
  let component: RideRequestToDriverComponent;
  let fixture: ComponentFixture<RideRequestToDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideRequestToDriverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideRequestToDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
