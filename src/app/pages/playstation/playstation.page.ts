import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Productos } from 'src/app/service/productos';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController

@Component({
  selector: 'app-playstation',
  templateUrl: './playstation.page.html',
  styleUrls: ['./playstation.page.scss'],
})
export class PlaystationPage implements OnInit {
  productos: Productos[] = [];

  constructor(private router: Router, private bdService: ServiceBDService, private alertController: AlertController) { }

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.bdService.obtenerProductos().then((data: Productos[]) => {
      this.productos = data;
      console.log(this.productos);
    }).catch((error: any) => {
      console.error('Error al obtener productos', error);
    });
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  async agregarAlCarrito(producto: { nombre: string, precio: number }) {
    try {
      const nuevoProducto: Productos = { id_prod: 0, nombre: producto.nombre, precio: producto.precio }; // Crear el nuevo producto
      await this.bdService.agregarProducto(nuevoProducto); // Pasar el objeto completo
      this.mostrarAlerta(`Producto ${producto.nombre} agregado al carrito exitosamente.`);
      // Si tienes un método para recargar productos desde el carrito, llámalo aquí
      // await this.cargarProductos(); // Comentado si no tienes esta función definida
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      this.mostrarAlerta('Error al agregar el producto al carrito.');
    }
  }
  


  irCarrito() {
    let navigationextras: NavigationExtras = {

    }

    this.router.navigate(['/carrito'], navigationextras);
  }
}