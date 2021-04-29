import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YouSureComponent } from './you-sure.component';

describe('YouSureComponent', () => {
  let component: YouSureComponent;
  let fixture: ComponentFixture<YouSureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YouSureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YouSureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
