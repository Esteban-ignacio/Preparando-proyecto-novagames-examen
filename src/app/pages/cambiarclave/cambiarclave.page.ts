import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-cambiarclave',
  templateUrl: './cambiarclave.page.html',
  styleUrls: ['./cambiarclave.page.scss'],
})
export class CambiarclavePage implements OnInit {

  correocambiarclave: string = "";
  contrasenacambiarclave: string = "";
  confirmarContrasenacambiarclave: string = "";

  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  ValidacionCambiarClave(){
    if (this.correocambiarclave.trim() === ''|| this.contrasenacambiarclave.trim() === '' || this.confirmarContrasenacambiarclave.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }
  
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Logrado','Contraseña Modificado con exito');
      this.IrInicio(); // Navegar a la página de inicio si el registro es exitoso
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Datos inválidos, por favor revise los datos ingresados.');
    }
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
