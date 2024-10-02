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
