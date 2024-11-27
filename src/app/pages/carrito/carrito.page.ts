import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
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

  productosConvertidos: any[] = [];

  selectedCurrency: string | null = 'clp'; // Moneda predeterminada a pesos chilenos

  tasasCambio: any = {}; // Objeto para almacenar las tasas de cambio
  tasaDolar: number = 0;
  tasaUF: number = 0;

  productosGuardados: number = 0; // Variable para almacenar la cantidad de productos guardados

  correoUsuario: string = '';  // Se debe obtener del usuario logueado

  constructor(private alertController: AlertController, private bdService: ServiceBDService) { }

  ngOnInit() {
    this.obtenerProductosCarrito(); // Llamar a la función para obtener los productos al iniciar
    this.tasaDolar = 970.87; // Tasa de conversión de pesos chilenos a dólares
    this.tasaUF = 37995.00;  // Tasa de conversión de pesos chilenos a UF
    this.convertirMoneda();   // Mostrar precios en el formato predeterminado (CLP)
  }

  ionViewWillEnter() {
    this.obtenerProductosCarrito(); // Asegura que el contador se actualice al entrar a la página
  }

  // Función para obtener productos del carrito desde el localStorage
  async obtenerProductosCarrito(): Promise<void> {
    try {
      // Obtener los productos desde localStorage
      const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

      // Verificar si hay productos en el carrito
      if (carrito.length === 0) {
        this.productos = [];
        this.productosConvertidos = [];
        return;
      }

      // Procesar los productos obtenidos
      console.log('Productos en el carrito:', carrito);
      this.productos = carrito;

      // Convertir los precios a la moneda seleccionada
      this.convertirMoneda();

      // Actualizar el contador de productos
      this.cargarContadorProductos();

    } catch (error) {
      console.error('Error al obtener los productos:', error);
      this.presentAlert('Error', 'No se pudieron cargar los productos del carrito.');
    }
  }

// Función para convertir el precio dependiendo de la moneda seleccionada
convertirPrecioMoneda(precio: number): number {
  let precioConvertido = precio;
  if (this.selectedCurrency === 'usd' && this.tasaDolar > 0) {
    precioConvertido = precio / this.tasaDolar;  // De pesos chilenos a dólares
  } else if (this.selectedCurrency === 'uf' && this.tasaUF > 0) {
    precioConvertido = precio / this.tasaUF;  // De pesos chilenos a UF
  }
  return precioConvertido;
}

  // Función para manejar la selección de moneda
  onCurrencyChange(event: any) {
    this.selectedCurrency = event.detail.value;
    this.convertirMoneda(); // Convertir los valores al cambiar la moneda
  }

 // Función para obtener la tasa de cambio desde el servicio
 obtenerTasaDeCambio() {
  this.bdService.obtenerIndicadores().subscribe(tasas => {
    this.tasasCambio = tasas;
    this.tasaDolar = tasas.dolar;
    this.tasaUF = tasas.uf;
    this.convertirMoneda(); // Al obtener las tasas, actualizamos los productos
  });
}

convertirMoneda() {
  this.productosConvertidos = this.productos.map(producto => {
    return { 
      ...producto, 
      precioConvertido: this.convertirPrecioMoneda(producto.precio) 
    };
  });
}

  // Calcular el subtotal del producto (cantidad * precio convertido)
  calcularSubtotal(producto: any): number {
    const precio = producto.precioConvertido || producto.precio;
    return precio * producto.cantidad;
  }

  // Calcular el total a pagar
  calcularTotalAPagar(): number {
    return this.productosConvertidos.reduce((total, producto: any) => {
      const precio = producto.precioConvertido || producto.precio;
      return total + (precio * producto.cantidad);
    }, 0);
  }

// Función para mostrar el precio formateado según la moneda seleccionada
formatCurrency(precio: number): string {
  if (this.selectedCurrency === 'usd') {
    return `$${precio.toFixed(2)} USD`; // Formato USD
  } else if (this.selectedCurrency === 'uf') {
    return `${precio.toFixed(2)} UF`; // Formato UF
  }
  return `$${precio.toLocaleString('es-CL')}`; // Formato CLP
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
    async modificarCantidad(accion: string, producto: any): Promise<void> {
      if (accion === 'incrementar') {
        if (producto.cantidad < producto.stock) {
          producto.cantidad += 1;
        } else {
          // Mostrar alerta si se intenta agregar más productos que el stock disponible
          await this.presentAlert('Stock máximo alcanzado', `No puedes agregar más de ${producto.stock} unidades de este producto.`);
          return; // No continuar si se alcanzó el stock máximo
        }
      } else if (accion === 'decrementar' && producto.cantidad > 1) {
        producto.cantidad -= 1;
      }
  
      // Guardar el carrito actualizado en localStorage
      this.bdService.agregarProducto(producto); // Actualizamos el producto con la nueva cantidad
      console.log('Cantidad actualizada:', producto.cantidad);
    }  

// Función para eliminar un producto del carrito
async eliminarProducto(producto: any) {
  const alert = await this.alertController.create({
    header: 'Eliminar Producto',
    message: '¿Estás seguro de que deseas eliminar este producto del carrito?',
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Eliminar',
        handler: async () => {
          // Llamamos directamente al servicio para eliminar el producto
          await this.bdService.eliminarProductoDelCarrito(producto);  // Llamamos a la función modificada para eliminar

          // Actualizamos los productos del carrito después de eliminar
          await this.obtenerProductosCarrito(); // Actualizamos la UI o el estado del carrito

          // Llamamos a cargarContadorProductos para actualizar el contador
          this.cargarContadorProductos();
        }
      }
    ]
  });

  await alert.present();
}

// Función para cargar el contador de productos guardados en localStorage
async cargarContadorProductos() {
  // Usamos el servicio para obtener el número de productos guardados en el carrito
  this.productosGuardados = await this.bdService.contarProductosGuardados(); 
  console.log('Productos guardados al cargar:', this.productosGuardados);
}

// Función cuando se presiona el botón de compra
async Notificacioncompra() {
  try {
    // Aquí deberías agregar el código para procesar la compra,
    // como la lógica de pago y la actualización de la base de datos

    // Enviar una notificación local
    await LocalNotifications.requestPermissions(); // Solicita permisos
    await LocalNotifications.schedule({
      notifications: [
        {
          title: 'Compra Confirmada',
          body: 'Tu compra se ha procesado con éxito.',
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) }, // Se mostrará 1 segundo después
          sound: 'default',
          // El campo `attachments` se ha eliminado ya que no lo necesitas
          actionTypeId: '',
          extra: null
        }
      ]
    });
  } catch (error) {
    console.error('Error al procesar la compra y mostrar notificación:', error);
  }
}


}


