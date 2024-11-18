export class Compra {
    id_compra!: number;           // ID de la compra
    v_venta!: number;             // Valor de la venta de un producto
    total_compra!: number;       // Total de la compra (si se compran varios productos)          
    correo_usuario!: string;     // Correo del usuario
    nombre_prod!: string;        // Nombre del producto comprado
    cantidad_prod!: number;      // Cantidad del producto comprado

    constructor(
        id_compra: number, 
        v_venta: number, 
        total_compra: number,  
        correo_usuario: string, 
        nombre_prod: string, 
        cantidad_prod: number
    ) {
        this.id_compra = id_compra;
        this.v_venta = v_venta;
        this.total_compra = total_compra;
        this.correo_usuario = correo_usuario;
        this.nombre_prod = nombre_prod;
        this.cantidad_prod = cantidad_prod;
    }
}

