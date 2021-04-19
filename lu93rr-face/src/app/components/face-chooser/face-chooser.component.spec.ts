import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaceChooserComponent } from './face-chooser.component';

describe('FaceChooserComponent', () => {
  let component: FaceChooserComponent;
  let fixture: ComponentFixture<FaceChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaceChooserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaceChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
