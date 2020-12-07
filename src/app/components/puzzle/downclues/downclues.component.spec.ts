import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DowncluesComponent } from './downclues.component';

describe('DowncluesComponent', () => {
  let component: DowncluesComponent;
  let fixture: ComponentFixture<DowncluesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DowncluesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DowncluesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
