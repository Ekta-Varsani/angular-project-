import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideScheduleComponent } from './ride-schedule.component';

describe('RideScheduleComponent', () => {
  let component: RideScheduleComponent;
  let fixture: ComponentFixture<RideScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideScheduleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
