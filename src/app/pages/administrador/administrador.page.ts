import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { Usuario } from 'src/app/service/usuario';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-administrador',
  templateUrl: './administrador.page.html',
  styleUrls: ['./administrador.page.scss'],
})
export class AdministradorPage implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private menuController: MenuController, private bdService: ServiceBDService, private router: Router) { }

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

}
