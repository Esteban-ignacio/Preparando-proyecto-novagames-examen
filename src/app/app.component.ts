import { Component } from '@angular/core';
import { ServiceBDService } from './service/service-bd.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private bdService: ServiceBDService, private router: Router) {}

  // Función para manejar el cierre de sesión
  async cerrarSesion() {
    // Limpiar el carrito
    await this.bdService.limpiarCarrito(); 

    this.router.navigate(['/login']);
  }

}
