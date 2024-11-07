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

  productos: Productos[] = []; // Lista para almacenar los productos del carrito

  constructor(private alertController: AlertController, private bdService: ServiceBDService) { }

  ngOnInit() {
    this.obtenerProductosCarrito(); // Llamar a la función para obtener los productos al iniciar
  }

  // Función para obtener los productos del carrito desde el servicio
  obtenerProductosCarrito() {
    this.bdService.fetchProductos().subscribe(productos => {
      this.productos = productos; // Asignamos los productos al array
    });
  }

  calcularTotalAPagar(): number {
    return this.productos.reduce((total, producto) => {
      return total + (producto.precio * producto.cantidad);
    }, 0);
  }

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Realizado'],
    });

    await alert.present();
  }

  // Función para manejar la compra
  Comprar() {
    this.presentAlert('Comprado', 'Compra Realizada');
  }
}



