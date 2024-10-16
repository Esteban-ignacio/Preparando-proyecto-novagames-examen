import { Component, OnInit } from '@angular/core';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Usuario } from 'src/app/service/usuario';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private bdService: ServiceBDService) { }

  ngOnInit() {
    // Esperar a que la base de datos esté lista
    this.bdService.dbState().subscribe(isReady => {
      if (isReady) {
        this.bdService.fetchNoticias().subscribe((usuarios: Usuario[]) => {
          this.usuarios = usuarios;
        });
  
        this.bdService.obtenerUsuarios(); // Obtener la lista de usuarios al iniciar
      }
    });
  }
  
}
