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

      // Validar correo, contraseña y confirmar contraseña con alertas específicas
      if (!this.isCorreoRecuperarClaveValido() || !this.isContrasenaRecuperarClaveValida()
        || !this.isConfirmarContrasenaRecuperarClaveValida()) {
          return; // Si alguno de los campos es inválido, no continuar
        }
  
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Logrado','Contraseña recuperada');
      this.RegresarLogin(); // Navegar a la página de inicio si el registro es exitoso
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

 // Validación para la contraseña
 isContrasenaRecuperarClaveValida(): boolean {
  const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con al menos una mayúscula, un número y un símbolo

  if (!regexPassword.test(this.contrasenarecuperarclave)) {
    this.presentAlert('Error', 'La contraseña debe tener entre 5 y 10 caracteres, incluir al menos una letra mayúscula, un número y un símbolo.');
    return false;
  }
  return true;
}

// Validación para confirmar contraseña
isConfirmarContrasenaRecuperarClaveValida(): boolean {
  if (this.confirmarContrasenarecuperarclave !== this.contrasenarecuperarclave) {
    this.presentAlert('Error', 'La contraseña no coincide.');
    return false;
  }
  return true;
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

  RegresarLogin(){
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/login'], navigationextras);
  }
}
