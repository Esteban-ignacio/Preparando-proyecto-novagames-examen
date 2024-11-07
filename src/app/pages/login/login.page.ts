import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController} from '@ionic/angular';
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

  usuario: Usuario = new Usuario();

  constructor(private router: Router, private alertController: AlertController, private bdService: ServiceBDService,
    private menuController: MenuController) { }

    ngOnInit() {
      // Esperar a que la base de datos esté lista
      this.bdService.dbState().subscribe(isReady => {
        if (isReady) {
          // Suscribirse al observable para obtener la lista de usuarios
          this.bdService.fetchUsuarios().subscribe(data => {
            this.usuarios = data;
          });
  
          // Llamar al método para obtener los usuarios desde la base de datos
          this.bdService.obtenerUsuarios();
        }
      });
      
      // Manejo de la navegación y el usuario recibido
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
        this.usuario = navigation.extras.state['usuario'] || new Usuario(); // Maneja el caso donde no haya un usuario
      } 
      // No es necesario inicializar nuevamente aquí porque ya lo has hecho arriba
    }

    async ValidacionLogin() {
      // Verificar que los campos no estén vacíos
      if (this.usuariologin.trim() === '' || this.correologin.trim() === '' || this.contrasenalogin.trim() === '') {
        this.presentAlert('Error', 'Por favor, complete todos los campos requeridos.');
        return; // Salir de la función si algún campo está vacío
      }
    
      // Validar nombre, correo y contraseña con alertas específicas
      if (!this.isUsuarioLoginValido() || !this.isCorreoLoginValido() || !this.isContrasenaLoginValida()) {
        return; // Si alguno de los campos es inválido, no continuar
      }
    
      // Llamamos a la función obtenerCorreoUsuario para verificar si el correo existe en la base de datos
      await this.bdService.obtenerCorreoUsuario(this.correologin);
    
      // Verificamos el resultado de la función (esto dependerá de cómo implementes el comportamiento en obtenerCorreoUsuario)
      // En este caso, asumimos que si el correo no existe, ya se habrá mostrado una alerta y no se continuará con el login
      if (this.bdService.listaobtenercorreousuario.value.length === 0) {
        return; // Si no se encuentra el correo, no continuar con el login
      }
    
      // Hacemos la validación de los datos
      if (this.isFormValid()) {
        try {
          // Llamar al método de login del servicio
          const loginResult = await this.bdService.login(this.usuariologin, this.correologin, this.contrasenalogin);
          
          if (loginResult.success) {
            this.presentAlert('Iniciado', 'Inicio exitoso');
            this.irPagina(); // Navegar a la página de inicio si el inicio es exitoso
    
            // Limpiar los campos de entrada después de un inicio exitoso
            this.usuariologin = ''; // Limpiar el campo de entrada
            this.correologin = ''; // Limpiar el campo de entrada
            this.contrasenalogin = ''; // Limpiar el campo de entrada
          } else {
            this.presentAlert('Error', 'No encontramos una cuenta asociada. Verifica tus datos o crea una nueva cuenta.');
          }
        } catch (error) {
          // Manejo de errores en caso de que algo falle en el login
          this.presentAlert('Error', 'Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo.');
          console.error(error); // Registro del error para depuración
        }
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
      state: { user: this.usuariologin },
    };
  
    if (this.correologin.includes('@admin')) {
      this.navegarYConfigurarMenu('/administrador', 'menu-admin', 'menu-usuarios', navigationExtras);
    } else if (this.correologin.includes('@')) {
      this.navegarYConfigurarMenu('/home', 'menu-usuarios', 'menu-admin', navigationExtras);
    }
  }
  
  navegarYConfigurarMenu(
    ruta: string,
    habilitarMenu: string,
    deshabilitarMenu: string,
    extras: NavigationExtras
  ) {
    this.router.navigate([ruta], extras);
    this.menuController.enable(true, habilitarMenu);
    this.menuController.enable(false, deshabilitarMenu);
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

