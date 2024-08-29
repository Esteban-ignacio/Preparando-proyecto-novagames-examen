import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XboxPage } from './xbox.page';

describe('XboxPage', () => {
  let component: XboxPage;
  let fixture: ComponentFixture<XboxPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(XboxPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
