import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Productos } from 'src/app/service/productos';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  productos: Productos[] = [];

  constructor(private alertController: AlertController,  private bdService: ServiceBDService) { }

  ngOnInit() {
    this.cargarProductos(); // Llamar a la función para cargar los productos
  }
  async cargarProductos() {
    this.productos = await this.bdService.obtenerProductosDesdeCarrito(); // Obtener los productos desde el servicio
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Realizado'],
    });
  
    await alert.present();
  }
  
  async agregarAlCarrito(producto: { nombre: string, precio: number }) {
    try {
      const nuevoProducto: Productos = { id_prod: 0, nombre: producto.nombre, precio: producto.precio }; // Crear el nuevo producto
      await this.bdService.agregarProducto(nuevoProducto); // Pasar el objeto completo
      this.presentAlert(`Producto ${producto.nombre} agregado al carrito exitosamente.`, ''); // Llamar a presentAlert con título y mensaje
      await this.cargarProductos(); // Cargar los productos nuevamente para actualizar la vista
    } catch (error) {
      console.error('Error al agregar producto al carrito:', error);
      this.presentAlert('Error al agregar el producto al carrito.', ''); // También aquí pasa ambos parámetros
    }
  }
  

  Comprar(){
    this.presentAlert('Comprado', 'Compra Realizada')
  }
}


