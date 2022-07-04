import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideConfirmedComponent } from './ride-confirmed.component';

describe('RideConfirmedComponent', () => {
  let component: RideConfirmedComponent;
  let fixture: ComponentFixture<RideConfirmedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideConfirmedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideConfirmedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
