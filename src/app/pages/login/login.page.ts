import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Usuario } from 'src/app/service/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuariologin: string = "";
  correologin: string = "";
  contrasenalogin: string = "";

  usuarios: Usuario[] = [];

  constructor(private router: Router, private alertController: AlertController, private bdService: ServiceBDService) { }

  ngOnInit() {
    // Esperar a que la base de datos esté lista
    this.bdService.dbState().subscribe(isReady => {
      if (isReady) {
        // Suscribirse al observable para obtener la lista de usuarios
        this.bdService.fetchNoticias().subscribe(data => {
          this.usuarios = data;
        });
  
        // Llamar al método para obtener los usuarios desde la base de datos
        this.bdService.obtenerUsuarios();
      }
    });
  }
  

  ValidacionLogin(){
    if (this.usuariologin.trim() === '' || this.correologin.trim() === ''|| this.contrasenalogin.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }

      // Validar nombre, correo y contraseña con alertas específicas
      if (!this.isUsuarioLoginValido() || !this.isCorreoLoginValido() || !this.isContrasenaLoginValida()) {
          return; // Si alguno de los campos es inválido, no continuar
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

  // Validación para el nombre y el apellido
  isUsuarioLoginValido(): boolean {
  const regexUsuarioLoginValido = /^[a-zA-Z]{2,9}$/; // Letras de 2 a 9 caracteres
  let isValid = true;

  // Validar nombre
  if (!regexUsuarioLoginValido.test(this.usuariologin)) {
    this.presentAlert('Error', 'El nombre debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
    }

    return isValid;
  }

  // Validación para el correo
  isCorreoLoginValido(): boolean {
  const regexCorreoLoginValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
  if (!regexCorreoLoginValido.test(this.correologin)) {
    this.presentAlert('Error', 'El correo debe tener un formato válido. Ejemplo: nombre@gmail.com');
    return false;
  }
  return true;
}

 // Validación para la contraseña
 isContrasenaLoginValida(): boolean {
  const regexContrasenaLoginValido = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con al menos una mayúscula, un número y un símbolo

  if (!regexContrasenaLoginValido.test(this.contrasenalogin)) {
    this.presentAlert('Error', 'La contraseña debe tener entre 5 y 10 caracteres, incluir al menos una letra mayúscula, un número y un símbolo.');
    return false;
  }
  return true;
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

