import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivergingbarComponent } from './divergingbar.component';

describe('DivergingbarComponent', () => {
  let component: DivergingbarComponent;
  let fixture: ComponentFixture<DivergingbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivergingbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivergingbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
