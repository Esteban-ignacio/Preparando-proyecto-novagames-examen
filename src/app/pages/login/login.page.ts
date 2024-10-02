import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuariologin: string = "";
  correologin: string = "";
  contrasenalogin: string = "";

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  ValidacionLogin(){
    if (this.usuariologin.trim() === '' || this.correologin.trim() === ''|| this.contrasenalogin.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }
  
    // Hacemos la validación de los datos
    if (this.isFormValid()) {
      // Si el formulario es válido, muestra un mensaje de éxito
      this.presentAlert('Iniciado', 'Inicio exitoso');
      this.irPagina(); // Navegar a la página de inicio si el registro es exitoso
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Datos inválidos, por favor revise los datos ingresados.');
    }
  }

  isFormValid(): boolean {
    const regex = /^[a-zA-Z]+$/; // Solo letras
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con mayúscula, número y símbolo

    return (
      this.usuariologin.trim() !== '' && // No debe estar vacío
      this.usuariologin.length >= 2 &&
      this.usuariologin.length <= 10 &&
      regex.test(this.usuariologin) &&

      this.correologin.trim() !== '' && // Correo no debe estar vacío
      regexEmail.test(this.correologin) && // Validación del correo


      this.contrasenalogin.trim() !== '' && // Contraseña no debe estar vacía
      regexPassword.test(this.contrasenalogin) // Validación de la contraseña
    );
  }
  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();

  }
  
  irPagina() {
    let navigationExtras: NavigationExtras = {
      state: {
        user: this.usuariologin
      }
    };

    // Verificar si el correo contiene @admin
    if (this.correologin.includes('@admin')) {
      this.router.navigate(['/administrador'], navigationExtras); // Redirigir a la página de admin
    } else if (this.correologin.includes('@')) {
      this.router.navigate(['/home'], navigationExtras); // Redirigir a la página de home
    }
}

  irRegistro(){
    let navigationextras: NavigationExtras={
    }
    this.router.navigate(['/registro'], navigationextras);
  }

  irRecuperar(){
    let navigationextras: NavigationExtras={
    }
    this.router.navigate(['/recuperarclave'], navigationextras);
  }
}

