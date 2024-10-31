import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GestionproductosPage } from './gestionproductos.page';

describe('GestionproductosPage', () => {
  let component: GestionproductosPage;
  let fixture: ComponentFixture<GestionproductosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionproductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
