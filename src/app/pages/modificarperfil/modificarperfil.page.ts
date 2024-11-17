import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Camera, CameraResultType } from '@capacitor/camera';
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

  imagen: any;
  
  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
    this.bdService.fetchExtraerdatosusuario().subscribe(datos => {
      if (datos.length > 0) {
        this.datosPerfil = datos[0]; // Asigna el primer elemento a datosPerfil
        this.nombremodificarperfil = this.datosPerfil.nombreuser || '';
        this.apellidomodificarperfil = this.datosPerfil.apellidouser || '';
        this.telefonomodificarperfil = this.datosPerfil.telefono_user || '';
      } else {
        this.presentAlert('Error', 'No se encontraron datos del perfil.');
      }
    });
  }

  takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri
    });
  
    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    this.imagen = image.webPath;
  
    
  };

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

  // Preparar los datos para actualizar
  const usuarioActualizar: Extraerdatosusuario = {
    iduser: this.datosPerfil.iduser,
    nombreuser: this.nombremodificarperfil || this.datosPerfil.nombreuser, // Mantener el valor anterior si está vacío
    apellidouser: this.apellidomodificarperfil || this.datosPerfil.apellidouser, // Mantener el valor anterior si está vacío
    correo_user: this.datosPerfil.correo_user, // No se modifica
    clave_user: this.datosPerfil.clave_user, // No se modifica
    telefono_user: this.telefonomodificarperfil || this.datosPerfil.telefono_user, // Mantener el valor anterior si está vacío
    imagen_user: this.datosPerfil.imagen_user
  };

  // Actualizar en la base de datos
  try {
    await this.bdService.actualizarUsuario(usuarioActualizar);
    this.presentAlert('Realizado', 'Perfil Modificado con éxito');
    this.limpiarCampos(); // Limpiar los campos tras una actualización exitosa
    this.VolveralPerfil(); // Navegar a la página de inicio si el registro es exitoso
  } catch (error) {
    console.error('Error al actualizar el perfil:', error);
    this.presentAlert('Error', 'No se pudo modificar el perfil. Inténtalo de nuevo más tarde.');
  }
  }

  limpiarCampos() {
    this.nombremodificarperfil = '';
    this.apellidomodificarperfil = '';
    this.telefonomodificarperfil = '';
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
    this.limpiarCampos(); // Limpiar los campos al regresar
    this.router.navigate(['/perfil'], navigationextras);
  }
  irCambiarcontra(){
    let navigationextras: NavigationExtras={
      state: { fromPage: 'modificarperfil' }
    }
    this.router.navigate(['/cambiarclave'], navigationextras);
  }

}
