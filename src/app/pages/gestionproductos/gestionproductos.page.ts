import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-gestionproductos',
  templateUrl: './gestionproductos.page.html',
  styleUrls: ['./gestionproductos.page.scss'],
})
export class GestionproductosPage implements OnInit {

  productosTotales: any[] = [
    { idproducto: 1, stockmaximo: 60 },
    { idproducto: 2, stockmaximo: 60 },
    { idproducto: 3, stockmaximo: 55 },
    { idproducto: 4, stockmaximo: 45 },
    { idproducto: 5, stockmaximo: 50 },
    { idproducto: 6, stockmaximo: 55 },
    { idproducto: 7, stockmaximo: 40 },
    { idproducto: 8, stockmaximo: 30 },
    { idproducto: 9, stockmaximo: 30 },
    { idproducto: 10, stockmaximo: 25 }
  ];

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

  formatCurrency(precio: number): string {
    return `$${precio.toLocaleString('es-CL')}`;
  }

  getStockMaximo(id_prod: number): number {
    // Busca el stock máximo según el ID del producto
    const productoEncontrado = this.productosTotales.find(
      producto => producto.idproducto === id_prod
    );
    return productoEncontrado ? productoEncontrado.stockmaximo : 0; // Devuelve el stock o 0 si no se encuentra
  }  
  
}