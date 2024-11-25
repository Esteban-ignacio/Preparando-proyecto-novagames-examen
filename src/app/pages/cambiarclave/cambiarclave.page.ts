import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-cambiarclave',
  templateUrl: './cambiarclave.page.html',
  styleUrls: ['./cambiarclave.page.scss'],
})
export class CambiarclavePage implements OnInit {

  correocambiarclave: string = "";
  contrasenacambiarclave: string = "";
  confirmarContrasenacambiarclave: string = "";

  preguntaSeleccionada: any = null;
  respuestaSeleccionada: string = '';
  mostrarPreguntas: boolean = false;
  respuestas: string[] = [];

  datosPerfil: any;

  mostrarBotonPerfil: boolean = false;

  mostrarBotonLogin: boolean = false;

  preguntas = [
    { pregunta: "¿Cuál es tu color favorito?", respuestas: ["Rojo", "Verde", "Azul"] },
    { pregunta: "¿En qué ciudad naciste?", respuestas: ["Madrid", "Barcelona", "Valencia"] },
    { pregunta: "¿Cuál es tu mascota favorita?", respuestas: ["Perro", "Gato", "Conejo"] }
  ];

  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const fromPage = navigation?.extras?.state?.['fromPage'] || history.state?.['fromPage'];
  
    console.log('From page:', fromPage); // Verificar de dónde viene el usuario
  
    // Obtener la pregunta seleccionada del localStorage
    const preguntaRecuperada = localStorage.getItem('preguntaSeleccionada');
  
    if (preguntaRecuperada) {
      this.preguntaSeleccionada = { pregunta: preguntaRecuperada, respuestas: [] };
    }
  
    // No cargar la respuesta seleccionada automáticamente
    this.respuestaSeleccionada = ''; // Asegúrate de que la respuesta esté vacía

    // Mostrar el botón de "Volver" solo si el usuario proviene de 'modificarperfil'
    this.mostrarBotonPerfil = fromPage === 'modificarperfil';
    this.mostrarBotonLogin = fromPage !== 'modificarperfil';

    // Obtener los datos del perfil solo si el usuario proviene de la página 'modificarperfil'
    if (fromPage === 'modificarperfil') {
      this.loadProfile();
    }
}  

loadProfile() {
  this.bdService.fetchExtraerdatosusuario().subscribe(datos => {
    if (datos.length > 0) {
      this.datosPerfil = datos[0]; // Asignar los datos del perfil
    }
  });
}

async ValidacionCambiarClave() {
  // Verificar que todos los campos estén completos
  if (this.correocambiarclave.trim() === '' || this.contrasenacambiarclave.trim() === '' || this.confirmarContrasenacambiarclave.trim() === '') {
    this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
    return; // Salir de la función si algún campo está vacío
  }

  // Validar correo, contraseña y confirmar contraseña con alertas específicas
  if (!this.isCorreoCambiarClaveValido() || !this.isContrasenaCambiarClaveValida() || !this.isConfirmarCambiarClaveValida()) {
    return; // Si alguno de los campos es inválido, no continuar
  }

  try {
    const existeCorreo = await this.bdService.verificarCorreoenrecuperarcontra(this.correocambiarclave);

    if (existeCorreo) {
      const navigation = this.router.getCurrentNavigation();
      const fromPage = navigation?.extras?.state?.['fromPage'] || history.state?.['fromPage'];

      if (fromPage === 'modificarperfil') {
        // Comparar el correo ingresado con el correo del perfil (directamente desde this.datosPerfil)
        if (this.datosPerfil && this.datosPerfil.correo_user !== this.correocambiarclave) {
          this.presentAlert('Error', 'El correo ingresado no coincide con el correo de la sesión actual.');
          return;
        }

        // Si los correos coinciden, proceder a cambiar la contraseña
        await this.bdService.actualizarClaveUsuario(this.correocambiarclave, this.contrasenacambiarclave);
        await this.presentAlert('Éxito', 'Cambio de contraseña exitoso');
        await this.router.navigate(['/perfil']);
      } else {
        this.mostrarPreguntas = true;
        await this.presentAlert('Preguntas de seguridad', 'Eliga la pregunta y respuesta de acuerdo a lo que ha escogido anteriormente.');
      }
    } else {
      this.presentAlert('Error', 'El correo no se ha encontrado. Ingrese otro correo o verifique sus datos.');
    }
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    this.presentAlert('Error', 'Hubo un problema al intentar cambiar la contraseña.');
  }
}

   // Validación para el correo
   isCorreoCambiarClaveValido(): boolean {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
    if (!regexEmail.test(this.correocambiarclave)) {
      this.presentAlert('Error', 'El correo debe tener un formato válido. Ejemplo: nombre@gmail.com');
      return false;
    }
    return true;
  }
  
   // Validación para la contraseña
   isContrasenaCambiarClaveValida(): boolean {
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con al menos una mayúscula, un número y un símbolo
  
    if (!regexPassword.test(this.contrasenacambiarclave)) {
      this.presentAlert('Error', 'La contraseña debe tener entre 5 y 10 caracteres, incluir al menos una letra mayúscula, un número y un símbolo.');
      return false;
    }
    return true;
  }
  
  // Validación para confirmar contraseña
  isConfirmarCambiarClaveValida(): boolean {
    if (this.confirmarContrasenacambiarclave !== this.contrasenacambiarclave) {
      this.presentAlert('Error', 'La contraseña no coincide.');
      return false;
    }
    return true;
  }

  isFormValid(): boolean {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con mayúscula, número y símbolo

    return (
      this.correocambiarclave.trim() !== '' &&// Correo no debe estar vacío
      regexEmail.test(this.correocambiarclave) && // Validación del correo

      this.contrasenacambiarclave.trim() !== '' && // Contraseña no debe estar vacía
      regexPassword.test(this.contrasenacambiarclave) && // Validación de la contraseña

      this.confirmarContrasenacambiarclave.trim() !== '' && // Confirmar contraseña no debe estar vacía
      this.confirmarContrasenacambiarclave === this.contrasenacambiarclave // Debe coincidir con la contraseña

    );
  }

  // Cargar respuestas según la pregunta seleccionada
  cargarRespuestas() {
    if (this.preguntaSeleccionada) {
      this.respuestas = this.preguntaSeleccionada.respuestas;
    }
  }

  // Continuar al siguiente paso
async siguientePaso() {
  try {
    // Obtén los valores almacenados en localStorage
    const preguntaGuardada = localStorage.getItem('preguntaSeleccionada');
    const respuestaGuardada = localStorage.getItem('respuestaSeleccionada');

    console.log('Pregunta seleccionada:', this.preguntaSeleccionada);
    console.log('Respuesta seleccionada:', this.respuestaSeleccionada);
    console.log('Pregunta guardada:', preguntaGuardada);
    console.log('Respuesta guardada:', respuestaGuardada);

    // Validar si la pregunta y respuesta coinciden
    if (
      this.respuestaSeleccionada.trim() === respuestaGuardada &&
      this.preguntaSeleccionada?.pregunta === preguntaGuardada
    ) {
      // Cambiar la contraseña en la base de datos usando actualizarClaveUsuario
      try {
        await this.bdService.actualizarClaveUsuario(this.correocambiarclave, this.contrasenacambiarclave);
        await this.presentAlert('Éxito', 'La contraseña ha sido cambiada con éxito.');
        
        // Redirigir a la página de login
        console.log('Redirigiendo a /login');
        await this.router.navigate(['/login']); // Redirige a la página de login
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        await this.presentAlert('Error', 'No se pudo cambiar la contraseña. Intente nuevamente.');
      }
    } else {
      // Mensaje de error si no coinciden
      console.log('Pregunta o respuesta no coinciden.');
      await this.presentAlert('Error', 'La pregunta o respuesta elegida no coincide con su elección anterior.');
    }
  } catch (error) {
    console.error('Error en la función siguientePaso:', error);
    await this.presentAlert('Error', 'Ocurrió un error inesperado.');
  }
} 

  // Cancelar el proceso de preguntas
  cancelarPreguntas() {
    this.mostrarPreguntas = false;
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();
  }

  limpiarCampos() {
    this.correocambiarclave = ''; // Limpiar correo
    this.contrasenacambiarclave = ''; // Limpiar contraseña
    this.confirmarContrasenacambiarclave = ''; // Limpiar confirmación de contraseña
  }
  
  IrPerfil() {
    let navigationextras: NavigationExtras = {};
    this.router.navigate(['/perfil'], navigationextras);
  }

  RegresarPerfil(){
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/perfil'], navigationextras);
  }

  RegresarLogin() {
    this.router.navigate(['/login']);
  }  

}
