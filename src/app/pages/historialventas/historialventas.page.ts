import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-historialventas',
  templateUrl: './historialventas.page.html',
  styleUrls: ['./historialventas.page.scss'],
})
export class HistorialventasPage implements OnInit {

  // Variables para almacenar los valores de los indicadores
  dolar: any;
  uf: any;
  ipc: any;

  constructor(private bdService: ServiceBDService) { }

  ngOnInit() {
     // Obtener los indicadores al iniciar
     this.obtenerIndicadores();
  }

  obtenerIndicadores() {
    this.bdService.obtenerIndicadores().subscribe(
      (data) => {
        // Acceder a los valores de los indicadores
        this.dolar = data.dolar;
        this.uf = data.uf;
        this.ipc = data.ipc;
        console.log('Datos obtenidos: ', data);
      },
      (error) => {
        console.error('Error al obtener los datos: ', error);
      }
    );
  }
  
}
