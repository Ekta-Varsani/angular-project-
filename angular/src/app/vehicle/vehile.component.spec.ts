import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehileComponent } from './vehile.component';

describe('VehileComponent', () => {
  let component: VehileComponent;
  let fixture: ComponentFixture<VehileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
