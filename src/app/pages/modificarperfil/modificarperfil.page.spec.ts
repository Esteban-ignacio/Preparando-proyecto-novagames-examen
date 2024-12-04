import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificarperfilPage } from './modificarperfil.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('ModificarperfilPage', () => {
  let component: ModificarperfilPage;
  let fixture: ComponentFixture<ModificarperfilPage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ModificarperfilPage],
      providers: [SQLite , HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(ModificarperfilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Prueba unitaria 3, validar campo nombre y apellido sean correctos
  it('debería validar correctamente el nombre y el apellido', () => {
    component.nombremodificarperfil = 'Juan';
    component.apellidomodificarperfil = 'Perez';
    const resultado = component.isNombreApellidoModificarPerfilValido();
    expect(resultado).toBeTrue();
  });

  //Prueba unitaria 4, validar campo nombre y apellido sean incorrectos
  it('debería mostrar error para nombre o apellido inválido', () => {
    component.nombremodificarperfil = 'J1'; // Inválido
    component.apellidomodificarperfil = 'Perez';
    const resultado = component.isNombreApellidoModificarPerfilValido();
    expect(resultado).toBeFalse();
  });

  //Prueba unitaria 5, validar campo telefono sea correcto
  it('debería validar correctamente el teléfono', () => {
    component.telefonomodificarperfil = '123456789';
    const resultado = component.isTelefonoModificarPerfilValido();
    expect(resultado).toBeTrue();
  });

  //Prueba unitaria 6, validar campo telefono sea incorrecto
  it('debería mostrar error para teléfono inválido', () => {
    component.telefonomodificarperfil = '12345'; // Inválido
    const resultado = component.isTelefonoModificarPerfilValido();
    expect(resultado).toBeFalse();
  });

});
