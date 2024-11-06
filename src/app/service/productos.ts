export class Productos {
  id_prod: number;
  nombre: string;
  descripcion: string;
  imagen_prod: string;
  precio: number;
  stock: number;
  cantidad: number; // Asegúrate de agregar esta propiedad

  constructor(id_prod: number, nombre: string, descripcion: string, imagen_prod: string, precio: number, stock: number, cantidad: number) {
    this.id_prod = id_prod;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen_prod = imagen_prod;
    this.precio = precio;
    this.stock = stock;
    this.cantidad = cantidad;
  }
}

