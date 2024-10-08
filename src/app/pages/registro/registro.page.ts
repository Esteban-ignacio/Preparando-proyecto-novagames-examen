import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  nombre: string = "";
  apellido: string = "";
  telefono: string = "";
  correo: string = "";
  contrasena: string = "";
  confirmarContrasena: string = "";

  constructor(private router: Router, private alertController: AlertController) { }
  
  ngOnInit() {
  }

  ValidacionRegistro(){
    if (this.nombre.trim() === '' || this.apellido.trim() === '' || this.telefono.trim() === '' || this.correo.trim() === ''
       || this.contrasena.trim() === '' || this.confirmarContrasena.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }

      // Validar nombre, apellido, teléfono, correo, contraseña y confirmar contraseña con alertas específicas
    if (!this.isNombreApellidoValido() || !this.isTelefonoValido() || !this.isCorreoValido() || !this.isContrasenaValida()
    || !this.isConfirmarContrasenaValida()) {
      return; // Si alguno de los campos es inválido, no continuar
    }
 
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Registro', 'Usuario Registrado');
      this.irHome(); // Navegar a la página de inicio si el registro es exitoso
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Datos inválidos, por favor revise los datos ingresados.');
    }
  }

  // Validación para el nombre y el apellido
isNombreApellidoValido(): boolean {
  const regexNombreApellido = /^[a-zA-Z]{2,9}$/; // Letras de 2 a 9 caracteres
  let isValid = true;

  // Validar nombre
  if (!regexNombreApellido.test(this.nombre)) {
    this.presentAlert('Error', 'El nombre debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
  }

  // Validar apellido
  if (!regexNombreApellido.test(this.apellido)) {
    this.presentAlert('Error', 'El apellido debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
  }

  return isValid;
}

// Validación para el teléfono
isTelefonoValido(): boolean {
  const regexTelefono = /^\d{9}$/; // Solo números y exactamente 9 dígitos
  if (!regexTelefono.test(this.telefono)) {
    this.presentAlert('Error', 'El teléfono debe contener exactamente 9 dígitos, no debe tener espacios ni simbolos y solo puede contener números.');
    return false;
  }
  return true;
}

 // Validación para el correo
 isCorreoValido(): boolean {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
  if (!regexEmail.test(this.correo)) {
    this.presentAlert('Error', 'El correo debe tener un formato válido. Ejemplo: nombre@gmail.com');
    return false;
  }
  return true;
}

 // Validación para la contraseña
 isContrasenaValida(): boolean {
  const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con al menos una mayúscula, un número y un símbolo

  if (!regexPassword.test(this.contrasena)) {
    this.presentAlert('Error', 'La contraseña debe tener entre 5 y 10 caracteres, incluir al menos una letra mayúscula, un número y un símbolo.');
    return false;
  }
  return true;
}

// Validación para confirmar contraseña
isConfirmarContrasenaValida(): boolean {
  if (this.confirmarContrasena !== this.contrasena) {
    this.presentAlert('Error', 'La contraseña no coincide.');
    return false;
  }
  return true;
}

  isFormValid(): boolean {
    const regex = /^[a-zA-Z]+$/; // Solo letras
    const regexPhone = /^\d{1,9}$/; // Solo números y hasta 9 dígitos
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con mayúscula, número y símbolo

    return (
      this.nombre.trim() !== '' && // No debe estar vacío
      this.nombre.length >= 2 &&
      this.nombre.length <= 10 &&
      regex.test(this.nombre) &&

      this.apellido.trim() !== '' && // Apellido no debe estar vacío
      this.apellido.length >= 2 && 
      this.apellido.length <= 10 && 
      regex.test(this.apellido) && // Validación del apellido

      this.telefono.trim() !== '' && // Teléfono no debe estar vacío
      regexPhone.test(this.telefono) && // Validación del teléfono

      this.correo.trim() !== '' && // Correo no debe estar vacío
      regexEmail.test(this.correo) && // Validación del correo

      this.contrasena.trim() !== '' && // Contraseña no debe estar vacía
      regexPassword.test(this.contrasena) && // Validación de la contraseña

      this.confirmarContrasena.trim() !== '' && // Confirmar contraseña no debe estar vacía
      this.confirmarContrasena === this.contrasena // Debe coincidir con la contraseña

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

  irHome(){
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/home'], navigationextras);
  
    }

  irPerfil(){
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/perfil'], navigationextras);
  
    }
  }
