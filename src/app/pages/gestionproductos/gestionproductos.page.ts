import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-gestionproductos',
  templateUrl: './gestionproductos.page.html',
  styleUrls: ['./gestionproductos.page.scss'],
})
export class GestionproductosPage implements OnInit {

  constructor(private menuCtrl: MenuController,  private serviceBD: ServiceBDService) {}

  productos: any[] = []; // Variable para almacenar los productos

  ngOnInit() {
    this.obtenerProductosParaAdmin();
  }

  ionViewWillEnter() {
    // Habilita el menú de administrador al entrar en esta página
    this.menuCtrl.enable(true, 'menu-admin');
    this.menuCtrl.enable(false, 'menu-usuarios');

  }

  async obtenerProductosParaAdmin() {
    // Llamar al servicio para obtener los productos
    this.productos = await this.serviceBD.obtenerProductosParaAdmin(); // Esperar los productos y asignarlos a la variable
  }
  
}