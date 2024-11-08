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

   // Función para obtener los productos desde la base de datos y las cantidades del carrito en localStorage
  obtenerProductosCarrito() {
    this.bdService.fetchProductos().subscribe(productos => {
      // Obtener los productos del carrito desde localStorage
      const carrito = this.bdService.obtenerCarrito();

      // Asociamos las cantidades del carrito con los productos obtenidos
      this.productos = productos.map(producto => {
        // Buscamos si el producto está en el carrito y le asignamos la cantidad correcta
        const productoEnCarrito = carrito.find(p => p.id_prod === producto.id_prod);
        
        // Si el producto está en el carrito, asignamos la cantidad; sino, la cantidad será 1
        if (productoEnCarrito) {
          producto.cantidad = productoEnCarrito.cantidad;
        } else {
          producto.cantidad = 1; // Establecemos la cantidad predeterminada a 1 si no está en el carrito
        }
        return producto;
      });
    });
  }

  formatCurrency(precio: number): string {
    return `$${precio.toLocaleString('es-CL')}`;
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

  // Modificar la cantidad de un producto
  modificarCantidad(accion: string, producto: any): void {
    // Verifica si la acción es incrementar o decrementar
    if (accion === 'incrementar') {
      producto.cantidad += 1;
    } else if (accion === 'decrementar' && producto.cantidad > 1) {
      producto.cantidad -= 1;
    }

    // Guardar el carrito actualizado en localStorage
    this.bdService.agregarProducto(producto); // Actualizamos el producto con la nueva cantidad
    console.log('Cantidad actualizada:', producto.cantidad);
  }

  // Función para manejar la compra
  Comprar() {
    this.presentAlert('Comprado', 'Compra Realizada');
  }
}



