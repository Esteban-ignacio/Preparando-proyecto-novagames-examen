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

  imagenmodificarperfil: any;
  
  constructor(private alertController: AlertController, private router: Router, private bdService: ServiceBDService) { }

  ngOnInit() {
    this.bdService.fetchExtraerdatosusuario().subscribe(datos => {
      if (datos.length > 0) {
        this.datosPerfil = datos[0]; // Asigna el primer elemento a datosPerfil
        this.nombremodificarperfil = this.datosPerfil.nombreuser || '';
        this.apellidomodificarperfil = this.datosPerfil.apellidouser || '';
        this.telefonomodificarperfil = this.datosPerfil.telefono_user || '';
        this.imagenmodificarperfil = this.datosPerfil.imagen_user || '';
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
    this.imagenmodificarperfil = image.webPath;
  
    
  };

  async ValidacionModificarPerfil() {
    if (!this.datosPerfil) {
      this.presentAlert('Error', 'No se encontró información del perfil.');
      return; // Salir si datosPerfil es undefined
    }

    if (!this.datosPerfil.correo_user) {
      this.presentAlert('Error', 'El correo del usuario no está disponible.');
      return; // Salir si correo_user es undefined
    }

    // Verificar si no se realizaron cambios en ningún campo
    const nombreCambiado = this.nombremodificarperfil !== this.datosPerfil.nombreuser;
    const apellidoCambiado = this.apellidomodificarperfil !== this.datosPerfil.apellidouser;
    const telefonoCambiado = this.telefonomodificarperfil !== this.datosPerfil.telefono_user;
    const imagencambiada = this.imagenmodificarperfil !== this.datosPerfil.imagen_user;

    // Validación para el nombre y apellido
    if ((nombreCambiado || apellidoCambiado) && !this.isNombreApellidoModificarPerfilValido()) {
      return; // Si la validación del nombre o apellido falla, se detiene la ejecución
    }

    // Validación para el teléfono
    if (telefonoCambiado && !this.isTelefonoModificarPerfilValido()) {
      return; // Si la validación del teléfono falla, se detiene la ejecución
    }

    // Verificar que los campos no estén vacíos si se desea hacer un cambio
    if ((nombreCambiado && !this.nombremodificarperfil.trim()) || 
        (apellidoCambiado && !this.apellidomodificarperfil.trim()) ||
        (telefonoCambiado && !this.telefonomodificarperfil.trim())) {
      this.presentAlert('Error', 'Los campos de nombre, apellido y teléfono no pueden estar vacíos.');
      return; // Salir si algún campo es vacío cuando se intenta modificarlo
    }

    if (!nombreCambiado && !apellidoCambiado && !telefonoCambiado && !imagencambiada) {
      this.presentAlert('Información', 'No se realizaron cambios en el perfil.');
      this.VolveralPerfil(); // Redirigir a la página de perfil
      return; // Salir si no se modificó ningún campo
    }

    // Preparar los datos para actualizar
    const usuarioActualizar: Extraerdatosusuario = {
      iduser: this.datosPerfil.iduser,
      nombreuser: nombreCambiado ? this.nombremodificarperfil : this.datosPerfil.nombreuser,
      apellidouser: apellidoCambiado ? this.apellidomodificarperfil : this.datosPerfil.apellidouser,
      correo_user: this.datosPerfil.correo_user, // No se modifica
      clave_user: this.datosPerfil.clave_user, // No se modifica
      telefono_user: telefonoCambiado ? this.telefonomodificarperfil : this.datosPerfil.telefono_user,
      imagen_user: imagencambiada ? this.imagenmodificarperfil : this.datosPerfil.imagen_user // Aquí se corrigió
    };

    // Actualizar en la base de datos
    try {
      await this.bdService.actualizarUsuario(usuarioActualizar);
      this.presentAlert('Realizado', 'Perfil modificado con éxito.');
      this.VolveralPerfil(); // Navegar a la página de perfil
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
      state: { fromPage: 'modificarperfil' }
    }
    this.router.navigate(['/cambiarclave'], navigationextras);
  }

}
