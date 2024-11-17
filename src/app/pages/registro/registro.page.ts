import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Usuario } from 'src/app/service/usuario';
import { Camera, CameraResultType } from '@capacitor/camera';

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

  imagen: any;

  constructor(private router: Router, private alertController: AlertController,  private bdService: ServiceBDService) { }
  
  ngOnInit() {
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

   async ValidacionRegistro(){
    if (this.nombre.trim() === '' || this.apellido.trim() === '' || this.telefono.trim() === '' || this.correo.trim() === ''
       || this.contrasena.trim() === '' || this.confirmarContrasena.trim() === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
      return; // Salir de la función si algún campo está vacío
    }

      // Validar nombre, apellido, teléfono, correo, contraseña y confirmar contraseña con alertas específicas
    if (!this.isNombreApellidoValido() || !this.isTelefonoValido() || !this.isCorreoValido() || !this.isContrasenaValida()
    || !this.isConfirmarContrasenaValida()) {
      return; // Si alguno de los campos es inválido, no continuar
    }

    // Verificar si la imagen ha sido proporcionada
  if (!this.imagen) {
    this.presentAlert('Error', 'Por favor, suba una imagen para el perfil.');
    return; // Salir de la función si la imagen no está proporcionada
  }

    // Verificar si el usuario ya está registrado
  const { emailExists, phoneExists } = await this.bdService.verificarUsuario(this.correo, this.telefono);
  
  if (emailExists) {
    this.presentAlert('Error', 'Este correo ya está registrado.');
    return; // Salir de la función si el correo ya está registrado
  }
  
  if (phoneExists) {
    this.presentAlert('Error', 'Este teléfono ya está registrado.');
    return; // Salir de la función si el teléfono ya está registrado
  }

  // Si el usuario no está registrado, proceder a insertarlo
  const nuevoUsuario = new Usuario();
  nuevoUsuario.nombreuser = this.nombre;
  nuevoUsuario.apellidouser = this.apellido;
  nuevoUsuario.correo_user = this.correo;
  nuevoUsuario.clave_user = this.contrasena; // Puedes encriptar la contraseña aquí
  nuevoUsuario.telefono_user = parseInt(this.telefono, 10); // Convertir a número
  // Agregar la imagen al nuevo usuario (aquí guardamos el valor de la imagen en la base de datos)
  nuevoUsuario.imagen_user = this.imagen; // Aquí se asigna la imagen que se ha tomado
  await this.bdService.insertarUsuario(nuevoUsuario);
  this.presentAlert('Éxito', 'Registro exitoso.'); // Mensaje de éxito
  // Limpiar los campos de entrada después del registro exitoso
  this.limpiarCampos();

  this.irlogin();
}

limpiarCampos() {
  this.nombre = '';
  this.apellido = '';
  this.telefono = '';
  this.correo = '';
  this.contrasena = '';
  this.confirmarContrasena = '';
}

  // Validación para el nombre y el apellido
isNombreApellidoValido(): boolean {
  const regexNombreApellido = /^[a-zA-Z]{2,9}$/; // Letras de 2 a 9 caracteres
  let isValid = true;

  // Validar nombre
  if (!regexNombreApellido.test(this.nombre)) {
    this.presentAlert('Error', 'El nombre debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
  }

  // Validar apellido
  if (!regexNombreApellido.test(this.apellido)) {
    this.presentAlert('Error', 'El apellido debe contener entre 2 y 9 letras, ademas solo puede contener caracteres alfabéticos.');
    isValid = false;
  }

  return isValid;
}

// Validación para el teléfono
isTelefonoValido(): boolean {
  const regexTelefono = /^\d{9}$/; // Solo números y exactamente 9 dígitos
  if (!regexTelefono.test(this.telefono)) {
    this.presentAlert('Error', 'El teléfono debe contener exactamente 9 dígitos, no debe tener espacios ni simbolos y solo puede contener números.');
    return false;
  }
  return true;
}

 // Validación para el correo
 isCorreoValido(): boolean {
  const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Expresión regular para el correo electrónico
  if (!regexEmail.test(this.correo)) {
    this.presentAlert('Error', 'El correo debe tener un formato válido. Ejemplo: nombre@gmail.com');
    return false;
  }
  return true;
}

 // Validación para la contraseña
 isContrasenaValida(): boolean {
  const regexPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{5,10}$/; // Contraseña con al menos una mayúscula, un número y un símbolo

  if (!regexPassword.test(this.contrasena)) {
    this.presentAlert('Error', 'La contraseña debe tener entre 5 y 10 caracteres, incluir al menos una letra mayúscula, un número y un símbolo.');
    return false;
  }
  return true;
}

// Validación para confirmar contraseña
isConfirmarContrasenaValida(): boolean {
  if (this.confirmarContrasena !== this.contrasena) {
    this.presentAlert('Error', 'La contraseña no coincide.');
    return false;
  }
  return true;
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

  irlogin(){
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/login'], navigationextras);
  
    }
  }
