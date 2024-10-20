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

  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
  }

 async ValidacionCambiarClave(){
    if (this.correocambiarclave.trim() === ''|| this.contrasenacambiarclave.trim() === '' || this.confirmarContrasenacambiarclave.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }

    // Validar correo, contraseña y confirmar contraseña con alertas específicas
    if (!this.isCorreoCambiarClaveValido() || !this.isContrasenaCambiarClaveValida()
      || !this.isConfirmarCambiarClaveValida()) {
        return; // Si alguno de los campos es inválido, no continuar
      }
  
      try {
        // Verificar si el correo existe en la base de datos
        const existeCorreo = await this.bdService.verificarCorreoenrecuperarcontra(this.correocambiarclave);
  
        if (existeCorreo) {
          // Actualizar la contraseña
          await this.bdService.actualizarClaveUsuario(this.correocambiarclave, this.contrasenacambiarclave);
          this.presentAlert('Éxito', 'La contraseña ha sido modificada con éxito.');
          this.IrInicio(); // Navegar a la página de inicio
        } else {
          this.presentAlert('Error', 'El correo ingresado no se encuentra registrado.');
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
  
  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();
  }
  IrInicio(){
    let navigationextras: NavigationExtras = {

    }
    this.router.navigate(['/home'], navigationextras);
  }
}
