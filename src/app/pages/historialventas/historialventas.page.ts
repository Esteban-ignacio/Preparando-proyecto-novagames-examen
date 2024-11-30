import { Component, OnInit } from '@angular/core';
import { Compra } from 'src/app/service/compra';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-historialventas',
  templateUrl: './historialventas.page.html',
  styleUrls: ['./historialventas.page.scss'],
})
export class HistorialventasPage implements OnInit {

compras: Compra[] = []; // Variable para almacenar las compras

constructor(private bdService: ServiceBDService) { }

ngOnInit() {
  // Llamamos a la función obtenerCompras cuando se inicializa la página
  this.obtenerCompras();
    
  // Suscribirse a la lista de compras
  this.bdService.listacompras.subscribe(compras => {
    this.compras = compras; // Asignamos las compras obtenidas a la variable compras
  });
}

// Llamar a la función obtenerCompras de nuestro servicio
async obtenerCompras(): Promise<void> {
  await this.bdService.obtenerCompras(); // Llamamos a la función del servicio que obtiene las compras
}

}








