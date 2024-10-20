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

  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
  }

  async ValidacionRecuperarClave(){
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
      this.presentAlert('Acceso aprobado','Ingrese los datos para cambiar su contraseña');
      this.Ircambiarcontra(); // Navegar a la página de inicio si el registro es exitoso
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

  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();
  }

  RegresarLogin(){
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
