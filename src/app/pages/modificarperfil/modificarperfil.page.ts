import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modificarperfil',
  templateUrl: './modificarperfil.page.html',
  styleUrls: ['./modificarperfil.page.scss'],
})
export class ModificarperfilPage implements OnInit {

  nombremodificarperfil: string = "";
  apellidomodificarperfil: string = "";
  telefonomodificarperfil: string = "";
  
  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }
  ValidacionModificarPerfil(){
    if (this.nombremodificarperfil.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }

     // Validar nombre, apellido, teléfono y correo con alertas específicas
     if (!this.isNombreApellidoModificarPerfilValido() || !this.isTelefonoModificarPerfilValido()) {
        return; // Si alguno de los campos es inválido, no continuar
      }
  
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Realizado', 'Perfil Modificado con exito');
      this.VolveralInicio(); // Navegar a la página de inicio si el registro es exitoso
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Datos inválidos, por favor revise los datos ingresados.');
    }
  }

   // Validación para el nombre y el apellido
   isNombreApellidoModificarPerfilValido(): boolean {
  const regexNombreApellido = /^[a-zA-Z]{2,9}$/; // Letras de 2 a 9 caracteres
  let isValid = true;

  // Validar nombre
  if (!regexNombreApellido.test(this.nombremodificarperfil)) {
    this.presentAlert('Error', 'El nombre debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
  }

  // Validar apellido
  if (!regexNombreApellido.test(this.apellidomodificarperfil)) {
    this.presentAlert('Error', 'El apellido debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
  }

  return isValid;
}

// Validación para el teléfono
isTelefonoModificarPerfilValido(): boolean {
  const regexTelefono = /^\d{9}$/; // Solo números y exactamente 9 dígitos
  if (!regexTelefono.test(this.telefonomodificarperfil)) {
    this.presentAlert('Error', 'El teléfono debe contener exactamente 9 dígitos, no debe tener espacios ni simbolos y solo puede contener números.');
    return false;
  }
  return true;
}

  isFormValid(): boolean {
    const regex = /^[a-zA-Z]+$/; // Solo letras
    const regexPhone = /^\d{1,9}$/; // Solo números y hasta 9 dígitos
   
    return (
      this.nombremodificarperfil.trim() !== '' && // No debe estar vacío
      this.nombremodificarperfil.length >= 2 &&
      this.nombremodificarperfil.length <= 10 &&
      regex.test(this.nombremodificarperfil) &&

      this.apellidomodificarperfil.trim() !== '' && // Apellido no debe estar vacío
      this.apellidomodificarperfil.length >= 2 && 
      this.apellidomodificarperfil.length <= 10 && 
      regex.test(this.apellidomodificarperfil) && // Validación del apellido

      this.telefonomodificarperfil.trim() !== '' && // Teléfono no debe estar vacío
      regexPhone.test(this.telefonomodificarperfil) // Validación del teléfono
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
  VolveralInicio(){
    let navigationextras: NavigationExtras = {

    }
    this.router.navigate(['/home'], navigationextras);
  }
  irCambiarcontra(){
    let navigationextras: NavigationExtras={
    }
    this.router.navigate(['/cambiarclave'], navigationextras);
  }

}
