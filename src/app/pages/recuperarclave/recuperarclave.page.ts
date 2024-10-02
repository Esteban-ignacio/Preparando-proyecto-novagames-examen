import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperarclave',
  templateUrl: './recuperarclave.page.html',
  styleUrls: ['./recuperarclave.page.scss'],
})
export class RecuperarclavePage implements OnInit {

  correorecuperarclave: string = "";
  contrasenarecuperarclave: string = "";
  confirmarContrasenarecuperarclave: string = "";

  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }

  ValidacionRecuperarClave(){
    if (this.correorecuperarclave.trim() === ''|| this.contrasenarecuperarclave.trim() === '' || this.confirmarContrasenarecuperarclave.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }
  
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Logrado','Contraseña recuperada');
      this.RegresarInicio(); // Navegar a la página de inicio si el registro es exitoso
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Datos inválidos, por favor revise los datos ingresados.');
    }
  }

  isFormValid(): boolean {
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con mayúscula, número y símbolo

    return (
      this.correorecuperarclave.trim() !== '' &&// Correo no debe estar vacío
      regexEmail.test(this.correorecuperarclave) && // Validación del correo

      this.contrasenarecuperarclave.trim() !== '' && // Contraseña no debe estar vacía
      regexPassword.test(this.contrasenarecuperarclave) && // Validación de la contraseña

      this.confirmarContrasenarecuperarclave.trim() !== '' && // Confirmar contraseña no debe estar vacía
      this.confirmarContrasenarecuperarclave === this.contrasenarecuperarclave // Debe coincidir con la contraseña

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

  Confirmarcontra(){
    //aqui hacemos las validaciones del formulario
    this.presentAlert('Logrado','Contraseña recuperada');
  }
  
  RegresarInicio(){
    let navigationextras: NavigationExtras = {

    }
    this.router.navigate(['/home'], navigationextras);
  }
}
