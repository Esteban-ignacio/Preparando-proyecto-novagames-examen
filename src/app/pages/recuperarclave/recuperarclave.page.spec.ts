import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarclavePage } from './recuperarclave.page';

describe('RecuperarclavePage', () => {
  let component: RecuperarclavePage;
  let fixture: ComponentFixture<RecuperarclavePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecuperarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
