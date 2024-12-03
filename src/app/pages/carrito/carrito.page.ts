import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AlertController } from '@ionic/angular';
import { Compra } from 'src/app/service/compra';
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
    return precio * producto.cantidad_detalle;
  }

  // Calcular el total a pagar
  calcularTotalAPagar(): number {
    return this.productosConvertidos.reduce((total, producto: any) => {
      const precio = producto.precioConvertido || producto.precio;
      return total + (precio * producto.cantidad_detalle);
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
  // Obtener el carrito actual desde localStorage
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  // Buscar el producto en el carrito
  const productoExistente = carrito.find((item: any) => item.id_prod === producto.id_prod);

  if (!productoExistente) {
    console.error("Producto no encontrado en el carrito.");
    return;
  }

  if (accion === 'incrementar') {
    // Verificar si hay stock disponible para incrementar
    if (productoExistente.cantidad_detalle < producto.stock) {
      productoExistente.cantidad_detalle += 1;
    } else {
      await this.presentAlert('Stock máximo alcanzado', `No puedes agregar más de ${producto.stock} unidades de este producto.`);
      return;
    }
  } else if (accion === 'decrementar') {
    // Verificar si se puede decrementar la cantidad
    if (productoExistente.cantidad_detalle > 1) {
      productoExistente.cantidad_detalle -= 1;
    } else {
      await this.presentAlert('Cantidad mínima alcanzada', `No puedes tener menos de 1 unidad.`);
      return;
    }
  }

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));

  // Actualizar la referencia del producto en la interfaz
  producto.cantidad_detalle = productoExistente.cantidad_detalle;

  console.log('Carrito actualizado:', carrito);
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
    // Crear la alerta de confirmación
    const alert = await this.alertController.create({
      header: 'Confirmar Compra',
      message: '¿Estás seguro de que deseas realizar la compra?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel', // Si elige 'Cancelar', no hace nada
          handler: () => {
            console.log('Compra cancelada');
          }
        },
        {
          text: 'Comprar',
          handler: () => {
            // No se utiliza await aquí para evitar errores con el flujo asíncrono
            this.procesarCompra();
          }
        }
      ]
    });

    // Mostrar la alerta de confirmación
    await alert.present();

  } catch (error) {
    console.error('Error al procesar la compra y mostrar notificación:', error);
    this.presentAlert('Error', 'Hubo un problema al procesar tu compra. Intenta nuevamente.');
  }
}

// Función para manejar la compra, de forma separada
async procesarCompra() {
  try {
    // Obtener la fecha de la compra
    const fechaCompra = new Date().toISOString(); // Fecha actual en formato ISO

    // Suponiendo que los productos han sido cargados correctamente en 'productosConvertidos'
    const productos: Compra[] = this.productosConvertidos.map(producto => {
      // Calculamos el subtotal para cada producto
      const subtotal = this.calcularSubtotal(producto);
      const total = this.calcularTotalAPagar(); // Total global (se calcula fuera de cada producto)

      // Crear un objeto Compra con todos los datos necesarios, incluyendo la fecha
      return {
        id_prod: producto.id_prod,            // ID del producto
        cantidad: producto.cantidad_detalle,   // Cantidad del producto en el carrito
        subtotal: subtotal,                    // Subtotal por cantidad
        total: total,                          // Total por producto
        id_compra: 0,                          // ID de la compra (debería ser asignado después si es necesario)
        v_venta: producto.precio,              // Valor de la venta: se puede obtener del precio del producto
        total_compra: this.calcularTotalAPagar(),  // Total de la compra global (cálculo total)
        correo_usuario: '',                    // El correo será gestionado directamente por la función guardarCompra
        fecha_compra: fechaCompra              // Fecha de la compra (en formato ISO)
      };
    });

    // Suponiendo que el total de la compra se calcula correctamente con la función 'calcularTotalAPagar'
    const totalCompra: number = this.calcularTotalAPagar(); // Total de la compra global
    const vVenta: number = this.productosConvertidos.reduce((total, producto) => total + producto.precio, 0); // Sumar el valor de la venta

    // Llamar a la función que guarda la compra en la base de datos
    const compraGuardada = await this.bdService.guardarCompra(productos, vVenta, totalCompra, fechaCompra);

    if (compraGuardada) {
      // Solicitar permisos para mostrar notificaciones
      await LocalNotifications.requestPermissions();
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Compra Confirmada',
            body: `Tu compra se ha procesado con éxito. Fecha de la compra: ${new Date(fechaCompra).toLocaleString()}`,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'default',
            actionTypeId: '',
            extra: null
          }
        ]
      });

      // Limpiar el carrito eliminando todos los productos
      for (let producto of this.productosConvertidos) {
        await this.eliminarProductodespuesdelacompra(producto);
      }

      // Actualizar el contador de productos
      this.cargarContadorProductos();

    } else {
      // Si no se pudo guardar la compra, mostrar alerta
      this.presentAlert('Error', 'Hubo un problema al procesar tu compra. Intenta nuevamente.');
    }
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    this.presentAlert('Error', 'Hubo un problema al procesar tu compra. Intenta nuevamente.');
  }
}

// Función para eliminar un producto del carrito cuando se termina de realizar la compra
async eliminarProductodespuesdelacompra(producto: any) {
  try {
    // Llamamos directamente al servicio para eliminar el producto
    await this.bdService.eliminarProductoDelacompra(producto);  // Llamamos a la función modificada para eliminar

    // Actualizamos los productos del carrito después de eliminar
    await this.obtenerProductosCarrito(); // Actualizamos la UI o el estado del carrito

    // Llamamos a cargarContadorProductos para actualizar el contador
    this.cargarContadorProductos();
  } catch (error) {
    console.error('Error al eliminar producto del carrito:', error);
    this.presentAlert('Error', 'Hubo un problema al eliminar el producto del carrito. Intenta nuevamente.');
  }
}


}


