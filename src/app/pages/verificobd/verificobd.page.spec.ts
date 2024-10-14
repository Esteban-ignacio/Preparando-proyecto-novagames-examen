import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerificobdPage } from './verificobd.page';

describe('VerificobdPage', () => {
  let component: VerificobdPage;
  let fixture: ComponentFixture<VerificobdPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificobdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
