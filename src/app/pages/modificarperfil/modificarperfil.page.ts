import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Extraerdatosusuario } from 'src/app/service/usuario';

@Component({
  selector: 'app-modificarperfil',
  templateUrl: './modificarperfil.page.html',
  styleUrls: ['./modificarperfil.page.scss'],
})
export class ModificarperfilPage implements OnInit {

  nombremodificarperfil: string = "";
  apellidomodificarperfil: string = "";
  telefonomodificarperfil: string = "";

  datosPerfil: Extraerdatosusuario | undefined; // Cambiar a un tipo más específico
  
  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
    this.bdService.fetchExtraerdatosusuario().subscribe(datos => {
      if (datos.length > 0) {
        this.datosPerfil = datos[0]; // Asigna el primer elemento a datosPerfil
        this.nombremodificarperfil = ''; // Mantener vacías las variables, si no se desean mostrar datos predeterminados
        this.apellidomodificarperfil = '';
        this.telefonomodificarperfil = '';
      } else {
        this.presentAlert('Error', 'No se encontraron datos del perfil.');
      }
    });
  }

  async ValidacionModificarPerfil() {
    // Primero validamos el formulario
    if (!this.isFormValid()) {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos y asegúrese de que los datos sean válidos.');
      return; // Salir de la función si la validación falla
    }

    if (!this.datosPerfil) {
    this.presentAlert('Error', 'No se encontró información del perfil.');
    return; // Salir si datosPerfil es undefined
  }

  if (!this.datosPerfil.correo_user) {
    this.presentAlert('Error', 'El correo del usuario no está disponible.');
    return; // Salir si correo_user es undefined
  }

  const usuarioActualizar: Extraerdatosusuario = {
    iduser: this.datosPerfil.iduser, // ID del usuario
    nombreuser: this.nombremodificarperfil,
    apellidouser: this.apellidomodificarperfil,
    correo_user: this.datosPerfil.correo_user, // Usar el correo obtenido de datosPerfil
    clave_user: this.datosPerfil.clave_user, // La contraseña no se modifica
    telefono_user: this.telefonomodificarperfil,
  };

  // Actualizar en la base de datos
  try {
    await this.bdService.actualizarUsuario(usuarioActualizar);
    this.presentAlert('Realizado', 'Perfil Modificado con éxito');
    this.VolveralPerfil(); // Navegar a la página de inicio si el registro es exitoso
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    this.presentAlert('Error', 'No se pudo modificar el perfil. Inténtalo de nuevo más tarde.');
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
  VolveralPerfil(){
    let navigationextras: NavigationExtras = {

    }
    this.router.navigate(['/perfil'], navigationextras);
  }
  irCambiarcontra(){
    let navigationextras: NavigationExtras={
    }
    this.router.navigate(['/cambiarclave'], navigationextras);
  }

}
