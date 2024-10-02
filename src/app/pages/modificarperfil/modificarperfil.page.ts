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
  correomodificarperfil: string = "";
  
  constructor(private alertController: AlertController, private router: Router) { }

  ngOnInit() {
  }
  ValidacionModificarPerfil(){
    if (this.nombremodificarperfil.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
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

  isFormValid(): boolean {
    const regex = /^[a-zA-Z]+$/; // Solo letras
    const regexPhone = /^\d{1,9}$/; // Solo números y hasta 9 dígitos
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico

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
      regexPhone.test(this.telefonomodificarperfil) && // Validación del teléfono

      this.correomodificarperfil.trim() !== '' && // Correo no debe estar vacío
      regexEmail.test(this.correomodificarperfil)  // Validación del correo

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
