import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroPage } from './registro.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RegistroPage', () => {
  let component: RegistroPage;
  let fixture: ComponentFixture<RegistroPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RegistroPage],
      providers: [SQLite, HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(RegistroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba unitaria 1, formulario no debe estar vacio
  it('Los campos no deben estar vacios', async () => {
    spyOn(component, 'presentAlert'); // Mock de la función que muestra la alerta
  
    component.nombre = '';
    component.apellido = '';
    component.telefono = '';
    component.correo = '';
    component.contrasena = '';
    component.confirmarContrasena = '';
    component.imagen = null; // Imagen no proporcionada
  
    await component.ValidacionRegistro();
  
    expect(component.presentAlert).toHaveBeenCalledWith('Error', 'Por favor, complete todos los campos requeridos.');
  });
  


});
