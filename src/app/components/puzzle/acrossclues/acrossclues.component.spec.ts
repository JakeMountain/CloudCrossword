import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrosscluesComponent } from './acrossclues.component';

describe('AcrosscluesComponent', () => {
  let component: AcrosscluesComponent;
  let fixture: ComponentFixture<AcrosscluesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcrosscluesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcrosscluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
