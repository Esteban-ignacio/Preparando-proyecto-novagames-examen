import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: string = "";
  contrasenal: string = "";

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  ValidacionLogin(){
    if (this.usuario.trim() === '' || this.contrasenal.trim() === '') {
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
    const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con mayúscula, número y símbolo

    return (
      this.usuario.trim() !== '' && // No debe estar vacío
      this.usuario.length >= 2 &&
      this.usuario.length <= 10 &&
      regex.test(this.usuario) &&

      this.contrasenal.trim() !== '' && // Contraseña no debe estar vacía
      regexPassword.test(this.contrasenal) // Validación de la contraseña
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
  
  irPagina(){
    //creamos nuestra variable de contexto
    let navigationextras: NavigationExtras = {
      state: {
        user: this.usuario
      }
    }
    this.router.navigate(['/home'], navigationextras);
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

