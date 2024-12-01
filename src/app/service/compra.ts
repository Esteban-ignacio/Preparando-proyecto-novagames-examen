export class Compra {
    id_compra!: number;           // ID de la compra
    v_venta!: number;             // Valor de la venta de un producto
    total_compra!: number;       // Total de la compra (si se compran varios productos)          
    correo_usuario!: string;     // Correo del usuario
    id_prod!: number;
    cantidad!: number;           // Cantidad del producto comprado
    subtotal!: number;           // Subtotal de ese producto
    total!: number;              // Total a pagar por el producto
    productos?: { 
        id_prod: number, 
        cantidad: number, 
        subtotal: number,
        nombre_prod: string,  // Nombre del producto
        foto_prod: string     // Foto del producto
    }[]; // Propiedad para los productos
}


