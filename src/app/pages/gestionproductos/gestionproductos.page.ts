import { Component, OnInit } from '@angular/core';
import { AlertController, MenuController } from '@ionic/angular';
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

  constructor(private menuCtrl: MenuController,  private serviceBD: ServiceBDService, private alertController: AlertController) {}

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
    try {
      // Llamar al servicio para obtener los productos
      this.productos = await this.serviceBD.obtenerProductosParaAdmin();
  
      // Verificar si los productos fueron obtenidos correctamente
      if (this.productos && this.productos.length > 0) {
      } else {
        this.presentAlert('Información', 'No se encontraron productos');
      }
  
    } catch (error) {
      // Mostrar una alerta si ocurre un error
      this.presentAlert('Error', 'Error al obtener los productos: ' + error);
    }
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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
  
    await alert.present();
  }  

  validarCantidad(cantidad: number, producto: any): boolean {
    const stockMaximo = this.getStockMaximo(producto.id_prod); // Stock máximo permitido
    const stockActual = producto.stock_prod; // Stock actual del producto
  
    // Validar si la cantidad es inválida o vacía
    if (!cantidad || cantidad <= 0) {
      this.presentAlert('Error', 'Por favor, ingresa un valor válido mayor a 0.');
      producto.cantidad = ''; // Limpiar el campo de cantidad
      return false;
    }
  
    // Validar si el stock actual ya alcanzó el máximo permitido
    if (stockActual >= stockMaximo) {
      this.presentAlert('Error', 'El stock ya está al máximo. No se puede agregar más.');
      producto.cantidad = ''; // Limpiar el campo de cantidad
      return false;
    }
  
    // Validar si la cantidad ingresada supera la cantidad máxima permitida
    const cantidadMaximaPermitida = stockMaximo - stockActual;
    if (cantidad > cantidadMaximaPermitida) {
      this.presentAlert('Error', `Solo puedes agregar hasta ${cantidadMaximaPermitida} unidades.`);
      producto.cantidad = ''; // Limpiar el campo de cantidad
      return false;
    }
  
    // Si todo es válido, muestra un mensaje de éxito
    producto.stock_prod += cantidad; // Actualiza el stock del producto
    this.presentAlert('Éxito', `Se han agregado ${cantidad} unidades correctamente.`);
    producto.cantidad = ''; // Limpia el campo de cantidad después de agregar
    return true;
  }  



async agregarStock(producto: any) {
  const cantidad = producto.cantidad;
  const stockMaximo = this.getStockMaximo(producto.id_prod);

  // Limpiar el campo de cantidad en caso de error
  producto.cantidad = '';

  // Verificar si la cantidad es válida antes de proceder
  if (cantidad <= 0 || isNaN(cantidad)) {
    this.presentAlert('Error', 'Por favor, ingresa un valor válido (solo números) mayor a 0.');
  } else if (cantidad > stockMaximo) {
    this.presentAlert('Error', `No puedes ingresar más de ${stockMaximo} unidades.`);
  } else {
    try {
      // Llamamos a la función de agregar stock del servicio
      await this.serviceBD.agregarStockProducto(producto.id_prod, cantidad);

      // Presentamos un mensaje de éxito
      this.presentAlert('Éxito', `Se agregaron ${cantidad} unidades al producto ${producto.nombre_prod}`);

      // Recargamos los productos para obtener los datos actualizados
      await this.obtenerProductosParaAdmin();

    } catch (error) {
      console.error('Error al agregar stock:', error);
      this.presentAlert('Error', 'Hubo un error al agregar el stock al producto.');
    }
  }
}  


}