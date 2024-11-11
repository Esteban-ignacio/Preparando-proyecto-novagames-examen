import { HttpClient } from '@angular/common/http';
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

  productosConvertidos: any[] = [];

  selectedCurrency: string | null = 'clp'; // Moneda predeterminada a pesos chilenos

  tasasCambio: any = {}; // Objeto para almacenar las tasas de cambio
  tasaDolar: number = 0;
  tasaUF: number = 0;

  constructor(private alertController: AlertController, private bdService: ServiceBDService) { }

  ngOnInit() {
    this.obtenerProductosCarrito(); // Llamar a la función para obtener los productos al iniciar
    this.tasaDolar = 970.87; // Tasa de conversión de pesos chilenos a dólares
    this.tasaUF = 37995.00;  // Tasa de conversión de pesos chilenos a UF
    this.convertirMoneda();   // Mostrar precios en el formato predeterminado (CLP)
  }

  // Función para obtener los productos del carrito y calcular precios convertidos
  obtenerProductosCarrito() {
    this.bdService.fetchProductos().subscribe((productos) => {
      console.log('Productos obtenidos de la base de datos:', productos);
      const carrito = this.bdService.obtenerCarrito();
      console.log('Contenido del carrito:', carrito);
  
      this.productos = productos.map((producto) => {
        const productoEnCarrito = carrito.find((p) => p.id_prod === producto.id_prod);
        if (productoEnCarrito) {
          producto.cantidad = productoEnCarrito.cantidad;
        } else {
          producto.cantidad = 1;
        }
        return producto;
      });
  
      // Convertimos los precios a la moneda predeterminada (CLP)
      this.convertirMoneda();
    });
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



