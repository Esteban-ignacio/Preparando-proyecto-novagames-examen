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

  productosPlayStation: any[] = [
    {
      id: 1,
      nombre: 'APEX LEGENDS',
      precio: 4000,
      stock: 60,
      imagenUrl: 'assets/img/imgplaystation/imagenapex.jfif',
      descripcion: `En este juego, hasta 60 jugadores forman escuadrones de tres personas y compiten en un campo de batalla en constante 
                    reducción para ser el último equipo en pie. Los jugadores eligen entre varios personajes, conocidos como "Leyendas",
                    cada uno con habilidades únicas que pueden afectar el juego, como crear escudos, curar a compañeros, o rastrear enemigos.
                   ¡Todo esto desde primera persona!`,
      cantidad: 1
    },
    {
      id: 2,
      nombre: 'FORTNITE',
      precio: 4000,
      stock: 60,
      imagenUrl: 'assets/img/imgplaystation/imagenfornite.jpg',
      descripcion: ` La experiencia más icónica de todos los battle royale tiene contenido nuevo constantemente y ofrece una gran variedad 
                     de modos de juego para todos los gustos y estilos.
                     Sé el último jugador de pie en el modo clásico de Batalla campal, construye estructuras para ganar ventaja sobre otros 
                     99 jugadores y logra conseguir una victoria campal.`,
      cantidad: 1
    },
    {
      id: 3,
      nombre: 'CALL OF DUTTY WARZONE 2',
      precio: 15000,
      stock: 55,
      imagenUrl: 'assets/img/imgplaystation/imagenwarzone.jpg',
      descripcion: ` Es un videojuego battle royale en el que hasta 150 jugadores compiten en un gigantesco mapa para ser el último 
                     equipo en pie. Los jugadores buscan armas, equipos y recursos mientras se enfrentan a otros equipos y evitan un círculo 
                     de gas que reduce constantemente el área de juego.`,
      cantidad: 1
    },
    {
      id: 4,
      nombre: 'PUBG: BATTLEGROUNDS',
      precio: 5000,
      stock: 45,
      imagenUrl: 'assets/img/imgplaystation/imagenpubg.jpg',
      descripcion: ` En este juego, hasta 100 jugadores se lanzan en paracaídas a una isla y compiten para ser el último en pie. Los jugadores deben 
                     explorar el entorno, buscar armas, vehículos y equipo, y sobrevivir en un mapa que se reduce gradualmente debido a una 
                    "zona azul" que daña a los que quedan fuera de ella.`,
      cantidad: 1
    },
    {
      id: 5,
      nombre: 'WARFACE: CLUTCH',
      precio: 10000,
      stock: 50,
      imagenUrl: 'assets/img/imgplaystation/imagenwarface.jpg',
      descripcion: ` Este juego de disparos por equipos representa una evolución para la jugabilidad de los battle royale y sigue siento popular 
                     más de una década después de su lanzamiento.
                     Elige entre cinco clases únicas: Rifleman, Medic, SED, Engineer y Sniper, cada una con una acción especial, como reponer 
                     municiones o restaurar armadura.`,
      cantidad: 1
    },
  ];

  aumentarCantidad(producto: any) {
    producto.cantidad = (producto.cantidad || 1) + 1;
  }

  disminuirCantidad(producto: any) {
    if (producto.cantidad && producto.cantidad > 1) {
      producto.cantidad -= 1;
    }
  }

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

  formatCurrency(precio: number): string {
    return `$${precio.toLocaleString('es-CL')}`;
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Información',
      message: mensaje,
      buttons: ['Aceptar'],
    });

    await alert.present();
  }

  irCarrito() {
    let navigationextras: NavigationExtras = {

    }

    this.router.navigate(['/carrito'], navigationextras);
  }
}