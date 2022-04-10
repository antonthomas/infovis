import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BettingComponent } from './betting.component';

describe('BettingComponent', () => {
  let component: BettingComponent;
  let fixture: ComponentFixture<BettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
