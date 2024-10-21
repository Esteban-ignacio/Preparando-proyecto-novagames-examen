import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Usuario } from 'src/app/service/usuario';
import { AlertController, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  correoAEliminar: string = '';

  usuarios: Usuario[] = [];

  constructor(private menuController: MenuController, private bdService: ServiceBDService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    // Esperar a que la base de datos esté lista
    this.bdService.dbState().subscribe(isReady => {
      if (isReady) {
        this.bdService.fetchUsuarios().subscribe((usuarios: Usuario[]) => {
          this.usuarios = usuarios;
        });
  
        this.bdService.obtenerUsuarios(); // Obtener la lista de usuarios al iniciar
      }
    });
  }

  ionViewWillLeave() {
    // Rehabilitar el menú de usuarios al salir de la página de administrador
    this.menuController.enable(true, 'menu-usuarios');
    this.menuController.enable(false, 'menu-admin');
  }

  eliminarUsuario() {
    if (this.correoAEliminar) {
      this.bdService.eliminarUsuario(this.correoAEliminar) // Cambia serviceBD a bdService
        .then(() => {
          console.log('Eliminación completada');
          // Mostrar alerta de confirmación
          this.bdService.presentAlert('Éxito', 'El usuario ha sido eliminado correctamente.');
          // Aquí puedes actualizar la lista de usuarios si lo deseas
          this.bdService.obtenerUsuarios(); // Actualiza la lista de usuarios
        })
        .catch((error: any) => { // Especificar el tipo para error
          console.error('Error en la eliminación:', error);
          this.bdService.presentAlert('Error', 'Error en la eliminación: ' + error);
        });
    } else {
      this.bdService.presentAlert('Error', 'Por favor ingresa un correo válido.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

}


