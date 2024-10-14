import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-verificobd',
  templateUrl: './verificobd.page.html',
  styleUrls: ['./verificobd.page.scss'],
})
export class VerificobdPage implements OnInit {

  tablasNoCreadas: string[] = [];
  tablasVerificadas: boolean = false; // Estado de verificación

  constructor(private bdService: ServiceBDService) { }

  ngOnInit() {
    this.bdService.createBD(); // Crear la base de datos y tablas
    setTimeout(() => {
      this.verificarTablas(); // Verificar las tablas después de crear la BD
    }, 2000); // Ajustar el tiempo si es necesari
  }

  async verificarTablas() {
    this.tablasNoCreadas = await this.bdService.verificarTablas();
    this.tablasVerificadas = true; // Cambia a true cuando se completa la verificación
  }

}
