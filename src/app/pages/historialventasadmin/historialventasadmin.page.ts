import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-historialventasadmin',
  templateUrl: './historialventasadmin.page.html',
  styleUrls: ['./historialventasadmin.page.scss'],
})
export class HistorialventasadminPage implements OnInit {
  // Inicializar la propiedad con un observable vacío
  ventasAdmin$: Observable<any[]> = new Observable();

  constructor(private menuCtrl: MenuController, private bdService: ServiceBDService) {}

  ngOnInit() {
    // Llamamos a la función obtenerVentasAdmin para obtener las ventas
    this.obtenerVentas();
    // Asignamos el observable de ventas a la propiedad 'ventasAdmin$'
    this.ventasAdmin$ = this.bdService.fetchVentas(); // Se suscribe a listaventasadmin
  }

  ionViewWillEnter() {
    // Habilita el menú de administrador al entrar en esta página
    this.menuCtrl.enable(true, 'menu-admin');
    this.menuCtrl.enable(false, 'menu-usuarios');
  }

  // Llamar al método obtenerVentasAdmin para obtener las ventas
  async obtenerVentas() {
    await this.bdService.obtenerVentasAdmin(); // Obtiene las ventas desde la base de datos
  }


  
}

