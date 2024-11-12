import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Productos } from 'src/app/service/productos';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-xbox',
  templateUrl: './xbox.page.html',
  styleUrls: ['./xbox.page.scss'],
})
export class XboxPage implements OnInit {

  correoUsuario: string = '';

  productosGuardados: number = 0; // Variable para almacenar la cantidad de productos guardados

  productosXbox: any[] = [
    {
      id: 6,
      nombre: 'FC 24',
      precio: 30000,
      stock: 55,
      imagenUrl: 'assets/img/imgxbox/imagenfc24.jpg',
      descripcion: `Sigue la tradición de simulación de fútbol con mejoras en jugabilidad, gráficos y modos de juego. Incluye ligas, clubes y 
                    jugadores licenciados, con modos populares como Ultimate Team, Carrera y Volta Football. EAFC 24 se destaca por su motor 
                    gráfico Hypermotion V, que ofrece movimientos más realistas, y la inclusión de equipos femeninos en Ultimate Team, proporcionando 
                    una experiencia de fútbol aún más diversa y auténtica.`,
      cantidad: 1
    },
    {
      id: 7,
      nombre: 'NBA 2K24',
      precio: 35000,
      stock: 40,
      imagenUrl: 'assets/img/imgxbox/imgnba.webp',
      descripcion: `Arma tu equipo y vive el pasado, el presente y el futuro de la cultura del baloncesto en NBA 2K24. Disfruta de una experiencia 
                    auténtica con opciones personalizadas ilimitadas de MyPLAYER, en MyCAREER. Colecciona una gran variedad de leyendas y arma tu 
                    alineación ideal en MyTEAM. Revive tus épocas favoritas como GM o Comisionado en MyNBA. Siente una jugabilidad de próximo nivel y 
                    disfruta de visuales ultrarrealistas mientras juegas con tus equipos favoritos de la NBA y la WNBA en JUEGA AHORA.`,
      cantidad: 1
    },
    {
      id: 8,
      nombre: 'GRAN TURISMO 7',
      precio: 15000,
      stock: 30,
      imagenUrl: 'assets/img/imgxbox/imggranturismo.jpg',
      descripcion: `Ya te guste competir, pilotar por diversión, coleccionar coches, optimizarlos, crear diseños o sacar fotografías, 
                    podrás encontrar tu trazada con esta increíble colección de modos de juego, que incluye algunos tan emblemáticos 
                    como Campaña GT, Arcade o Escuela de conducción.`,
      cantidad: 1
    },
    {
      id: 9,
      nombre: 'PGA TOUR 2K23',
      precio: 20000,
      stock: 30,
      imagenUrl: 'assets/img/imgxbox/imgpga.jpg',
      descripcion: `Adéntrate en el deporte del swing con el simulador de golf más realista que hay. Elige entre 14 profesionales jugables
                    masculinos y femeninos y disfruta de 20 campos reales, desde Quail Hollow hasta el Riviera Country Club.`,
      cantidad: 1
    },
    {
      id: 10,
      nombre: 'EA SPORTS NHL 24',
      precio: 10000,
      stock: 25,
      imagenUrl: 'assets/img/imgxbox/imgnhl.jpg',
      descripcion: `Entra en el hielo y disfruta de los bloqueos, los slapshots y las jugadas ofensivas de la NHL.
                    Siente el crujido de cada golpe con las físicas y animaciones mejoradas mientras el nuevo Exhaust Engine se centra en la presión 
                    que se acumula durante las jugadas ofensivas y pasando tiempo en la zona de ataque.`,
      cantidad: 1
    },
    
];

  productos: Productos[] = [];

  constructor(private bdService: ServiceBDService, private alertController: AlertController) { }

  ngOnInit() {
    const correoUsuario = localStorage.getItem('correoUsuario');
    if (correoUsuario) {
      this.correoUsuario = correoUsuario;
      this.contarProductosGuardados();  // Llamamos a contar los productos guardados al iniciar
    }
  }

  formatCurrency(precio: number): string {
    return `$${precio.toLocaleString('es-CL')}`;
  }

  // Llamamos a la función contarProductosGuardados para actualizar la cantidad de productos guardados
  async contarProductosGuardados() {
    try {
      this.productosGuardados = await this.bdService.contarProductosGuardados();
      console.log('Productos guardados:', this.productosGuardados);  // Muestra en consola la cantidad de productos guardados
    } catch (error) {
      console.error('Error al contar los productos guardados:', error);
    }
  }

  guardarProductoEnBD(producto: any): void {
    if (producto.cantidad > 0) {
      const productoAGuardar: Productos = {
        id_prod: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        stock: producto.stock,
        imagen_prod: producto.imagenUrl,
        descripcion: producto.descripcion,
        cantidad: producto.cantidad
      };
  
      console.log('Producto a guardar:', productoAGuardar);
  
      // Llamamos a guardarProducto y no necesitamos pasar el correo
      this.bdService.guardarProducto(productoAGuardar, producto.cantidad)
        .then(() => {
          this.mostrarAlerta('Producto agregado al carrito correctamente');
          this.contarProductosGuardados();  // Actualizamos la cantidad de productos guardados después de agregar uno
        })
        .catch((error: any) => {
          console.error('Error al guardar el producto', error);
          // Aquí solo se maneja el error en caso de fallo
        });
    }
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
