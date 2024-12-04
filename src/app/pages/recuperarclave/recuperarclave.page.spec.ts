import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperarclavePage } from './recuperarclave.page';
import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('RecuperarclavePage', () => {
  let component: RecuperarclavePage;
  let fixture: ComponentFixture<RecuperarclavePage>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarclavePage],
      providers: [SQLite , HttpClient, HttpHandler]
    }).compileComponents();
    fixture = TestBed.createComponent(RecuperarclavePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  //Prueba unitaria 7, ocultar preguntas al cancelar
  it('ocultar las preguntas cuando se cancela', () => {
    component.mostrarPreguntas = true;
  
    component.cancelarPreguntas();
  
    expect(component.mostrarPreguntas).toBeFalse();
  });

  //Prueba unitaria 8, error al no seleccionar una respuesta
  it('mostrar un error si no se selecciona una respuesta', () => {
    spyOn(component, 'presentAlert');
    component.preguntaSeleccionada = { pregunta: '¿Cuál es tu color favorito?' };
    component.respuestaSeleccionada = ''; // Respuesta no seleccionada
  
    component.siguientePaso();
  
    expect(component.presentAlert).toHaveBeenCalledWith('Error', 'Por favor, selecciona una respuesta antes de continuar.');
  });

  //Prueba unitaria 9, cargar respuestas al seleccionar una pregunta
  it('cargar las respuestas de la pregunta seleccionada', () => {
    component.preguntaSeleccionada = { pregunta: '¿Cuál es tu color favorito?', respuestas: ['Rojo', 'Verde', 'Azul'] };
  
    component.cargarRespuestas();
  
    expect(component.respuestas).toEqual(['Rojo', 'Verde', 'Azul']);
  });

  //Prueba unitaria 10, validar campo correo que sea correcto
  it('validar correctamente un correo electrónico válido', () => {
    component.correorecuperarclave = 'usuario@dominio.com';
    const resultado = component.isCorreoRecuperarClaveValido();
    expect(resultado).toBeTrue();
  });

});
