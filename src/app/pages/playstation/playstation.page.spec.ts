import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaystationPage } from './playstation.page';

describe('PlaystationPage', () => {
  let component: PlaystationPage;
  let fixture: ComponentFixture<PlaystationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaystationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
