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

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }

  ValidacionNombre(){
    // Hacemos la validación
    if (this.isFormValid()) {
      // Si el formulario es válido, navega a la página de inicio
      this.presentAlert('Iniciado', 'Inicio exitoso', true);
    } else {
      // Si el formulario es inválido, muestra un mensaje de error en la alerta
      this.presentAlert('Error', 'Nombre de usuario inválido.', false);
    }
  }

  isFormValid(): boolean {
    const regex = /^[a-zA-Z]+$/; // Solo letras
    return (
      this.usuario.trim() !== '' && // No debe estar vacío
      this.usuario.length >= 2 &&
      this.usuario.length <= 10 &&
      regex.test(this.usuario)
    );
  }
  async presentAlert(titulo: string, msj: string, navegar: boolean) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();

    // Aquí es donde realizamos la navegación si la validación es exitosa
    if (navegar) {
      this.irPagina();
    }
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

