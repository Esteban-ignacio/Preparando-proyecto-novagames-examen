import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-recuperarclave',
  templateUrl: './recuperarclave.page.html',
  styleUrls: ['./recuperarclave.page.scss'],
})
export class RecuperarclavePage implements OnInit {

  correorecuperarclave: string = "";

  preguntaSeleccionada: any = null;
  respuestaSeleccionada: string = '';
  mostrarPreguntas: boolean = false;
  respuestas: string[] = [];

  preguntas = [
    { pregunta: "¿Cuál es tu color favorito?", respuestas: ["Rojo", "Verde", "Azul"] },
    { pregunta: "¿En qué ciudad naciste?", respuestas: ["Madrid", "Barcelona", "Valencia"] },
    { pregunta: "¿Cuál es tu mascota favorita?", respuestas: ["Perro", "Gato", "Conejo"] }
  ];

  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
  }

  async ValidacionRecuperarClave() {
    if (this.correorecuperarclave.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }
  
    // Verificar si el correo existe en la base de datos
    const existeCorreo = await this.bdService.verificarCorreoenrecuperarcontra(this.correorecuperarclave);
  
    if (!existeCorreo) {
      this.presentAlert('Error', 'El correo no se ha encontrado.');
      return; // Si el correo no existe, detener la ejecución
    }
  
    // Validar correo, contraseña y confirmar contraseña con alertas específicas
    if (!this.isCorreoRecuperarClaveValido()) {
      return; // Si alguno de los campos es inválido, no continuar
    }
  
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Acceso aprobado', 'Ingrese los datos para cambiar su contraseña');
  
      // Si todo está bien, mostrar preguntas
      this.mostrarPreguntas = true;
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Datos inválidos, por favor revise los datos ingresados.');
    }
  }

  // Validación para el correo
  isCorreoRecuperarClaveValido(): boolean {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
  if (!regexEmail.test(this.correorecuperarclave)) {
    this.presentAlert('Error', 'El correo debe tener un formato válido. Ejemplo: nombre@gmail.com');
    return false;
  }
  return true;
}

  isFormValid(): boolean {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
    
    return (
      this.correorecuperarclave.trim() !== '' &&// Correo no debe estar vacío
      regexEmail.test(this.correorecuperarclave)  // Validación del correo

    );
  }

 // Cargar las respuestas cuando se seleccione una pregunta
 cargarRespuestas() {
  if (this.preguntaSeleccionada) {
    this.respuestas = this.preguntaSeleccionada.respuestas;
  }
}

// Función para pasar a la siguiente pregunta o finalizar
siguientePaso() {
  if (this.respuestaSeleccionada) {
    // Guardamos la pregunta y respuesta seleccionada en el localStorage
    localStorage.setItem('preguntaSeleccionada', this.preguntaSeleccionada.pregunta);
    localStorage.setItem('respuestaSeleccionada', this.respuestaSeleccionada);

    // Limpiar el campo de correo solo cuando el proceso sea exitoso
    this.correorecuperarclave = '';

    // Se termina el proceso cuando se selecciona una respuesta
    this.router.navigate(['/cambiarclave']);
  } else {
    this.presentAlert('Error', 'Por favor, selecciona una respuesta antes de continuar.');
  }
}

// Función para cancelar el proceso
cancelarPreguntas() {
  this.mostrarPreguntas = false;
}

  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();
  }

  RegresarLogin(){
    this.correorecuperarclave = ''; // Limpiar campo al regresar al login
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/login'], navigationextras);
  }

  Ircambiarcontra(){
    let navigationextras: NavigationExtras = {
      state: { fromPage: 'recuperarclave' }
    }
    this.router.navigate(['/cambiarclave'], navigationextras);
  }

}
