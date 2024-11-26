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

  async eliminarUsuario() {
    if (this.correoAEliminar) {
      const alert = await this.alertController.create({
        header: 'Eliminar Usuario',
        message: '¿Estás seguro de que deseas eliminar este usuario?',
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
          },
          {
            text: 'Eliminar',
            handler: async () => {
              try {
                // Llamamos al servicio para eliminar el usuario
                await this.bdService.eliminarUsuario(this.correoAEliminar);
                // Eliminación exitosa
                this.presentAlert('Éxito', 'El usuario ha sido eliminado correctamente.');
                this.correoAEliminar = ''; // Limpiar el campo de entrada
                // Actualiza la lista de usuarios
                this.bdService.obtenerUsuarios();
              } catch (error) {
                // Mostrar alerta de error si no se encuentra el usuario
                this.presentAlert('Error', 'Este correo no se ha encontrado.');
              }
            }
          }
        ]
      });
  
      // Presenta la alerta
      await alert.present();
    } else {
      this.presentAlert('Error', 'Por favor ingresa un correo válido.');
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


