import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarclavePage } from './cambiarclave.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('CambiarclavePage', () => {
  let component: CambiarclavePage;
  let fixture: ComponentFixture<CambiarclavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [CambiarclavePage],
      providers: [SQLite , HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(CambiarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Prueba unitaria 2, limpiar campos correo, contraseña y confirmacontra
  it('limpiar campos al cambiar la clave', () => {
    // Asignar valores a los campos
    component.correocambiarclave = 'test@example.com';
    component.contrasenacambiarclave = 'Test123!';
    component.confirmarContrasenacambiarclave = 'Test123!';

    // Llamar al método limpiarCampos
    component.limpiarCampos();

    // Verificar que los campos se han limpiado
    expect(component.correocambiarclave).toBe('');
    expect(component.contrasenacambiarclave).toBe('');
    expect(component.confirmarContrasenacambiarclave).toBe('');
  });

});
