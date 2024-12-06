import { Component, OnInit } from '@angular/core';
import { Productos } from 'src/app/service/productos';
import { ServiceBDService } from 'src/app/service/service-bd.service';
import { AlertController } from '@ionic/angular'; // Importa AlertController
import { Router } from '@angular/router';

@Component({
  selector: 'app-playstation',
  templateUrl: './playstation.page.html',
  styleUrls: ['./playstation.page.scss'],
})
export class PlaystationPage implements OnInit {

  productosPlayStation: any[] = []; // Lista dinámica para almacenar productos obtenidos

  constructor(private bdService: ServiceBDService, private alertController: AlertController, private router: Router) { }

  ngOnInit() {
    this.cargarProductosPlayStation();
  }  

  async cargarProductosPlayStation() {
    // Llamar a la función para obtener productos desde la base de datos
    const productosBD = await this.bdService.obtenerProductosPlayStation();
  
    // Mapear los datos para que coincidan con las propiedades del HTML
    this.productosPlayStation = productosBD.map((producto: any) => ({
      id: producto.id_prod,
      nombre: producto.nombre_prod,
      imagenUrl: producto.foto_prod, // URL de la imagen
      precio: producto.precio_prod,
      stock: producto.stock_prod,
      descripcion: producto.descripcion_prod,
      cantidad: 1, // Se inicializa la cantidad
    }));
  
    // Guardar en localStorage para persistencia
    localStorage.setItem('productosPlayStation', JSON.stringify(this.productosPlayStation));
  }  

  formatCurrency(precio: number): string {
    return `$${precio.toLocaleString('es-CL')}`;
  }

  // Función para reducir el stock local y guardar el producto en la base de datos
guardarProductoEnBD(producto: any): void {
  if (producto.cantidad > 0 && producto.stock > 0) {
    // Reducir el stock en 1 de forma local
    producto.stock -= 1;

    // Llamar a la función para actualizar el stock en la base de datos
    this.bdService.actualizarStockProducto(producto.id, producto.stock).then(() => {
      // Crear el objeto que se enviará a la base de datos
      const productoAGuardar: Productos = {
        id_prod: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock, // Usamos el stock actualizado
        imagen_prod: producto.imagenUrl,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad,
      };

      // Intentar guardar el producto en la base de datos (carrito)
      this.bdService.guardarProducto(productoAGuardar, producto.cantidad)
        .then(() => {
          // Actualizar localStorage solo si la operación fue exitosa
          localStorage.setItem('productosPlayStation', JSON.stringify(this.productosPlayStation));
          this.mostrarAlerta('Producto agregado al carrito correctamente');
        })
        .catch((error: any) => {
          console.error('Error al guardar el producto en la base de datos', error);
          this.mostrarAlerta('No se pudo agregar el producto al carrito.');

          // Revertir la reducción de stock si ocurre un error
          producto.stock += 1;
        });
    }).catch((error) => {
      console.error('Error al actualizar el stock en la base de datos', error);
      this.mostrarAlerta('No se pudo actualizar el stock en la base de datos.');
    });
  } else {
    // Mensaje de error si no hay stock suficiente
    this.mostrarAlerta('Producto no disponible, no existe el suficiente stock como para agregar el producto al carrito.');
  }
}

  irAlCarrito() {
    this.router.navigate(['/carrito']);
  }
  
  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

}

