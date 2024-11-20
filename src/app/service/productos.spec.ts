import { Productos } from './productos';

describe('Productos', () => {
  it('should create an instance', () => {
    const producto = new Productos(
      1, // id_prod
      'Nombre de prueba', // nombre
      'Descripción de prueba', // descripcion
      'imagen.jpg', // imagen_prod
      100, // precio
      10, // stock
      1 // cantidad
    );
    expect(producto).toBeTruthy();
  });
});

