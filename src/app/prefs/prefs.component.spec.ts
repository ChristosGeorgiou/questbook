import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrefsComponent } from './prefs.component';

describe('PrefsComponent', () => {
  let component: PrefsComponent;
  let fixture: ComponentFixture<PrefsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrefsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrefsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
