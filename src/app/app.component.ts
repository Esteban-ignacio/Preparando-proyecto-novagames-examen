import { Component } from '@angular/core';
import { ServiceBDService } from './service/service-bd.service';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private bdService: ServiceBDService, private router: Router, private menuCtrl: MenuController) {}

  navegarYCerrar(ruta: string) {
    // Navega a la página seleccionada
    this.router.navigate([ruta]).then(() => {
      // Cierra el menú después de la navegación
      this.menuCtrl.close('menu-admin');
    });
  }

  // Función para manejar el cierre de sesión
  async cerrarSesion() {
    // Limpiar el carrito
    await this.bdService.limpiarCarrito(); 

    this.router.navigate(['/login']);
  }

}
