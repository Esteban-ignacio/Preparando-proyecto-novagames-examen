export class Productos {
    id_prod!: number;
    nombre!: string;
    precio!: number;
    stock!: number;
    imagen_prod!: string;
    descripcion!: string;

    // Constructor que recibe 6 parámetros
  constructor(id_prod: number, nombre: string, descripcion: string, imagen_prod: string, precio: number, stock: number) {
    this.id_prod = id_prod;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.imagen_prod = imagen_prod;
    this.precio = precio;
    this.stock = stock;
  }
}
