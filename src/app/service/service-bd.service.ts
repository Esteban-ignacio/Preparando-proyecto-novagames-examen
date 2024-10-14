import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  //variable de conexion a la BD
  public database!: SQLiteObject;

  //variables de las tablas
  tablaRol: string = `
  CREATE TABLE IF NOT EXISTS rol (
    id_rol INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre_rol VARCHAR(100) NOT NULL
  );
  `;
  
  tablaCategoria: string = `
  CREATE TABLE IF NOT EXISTS categoria (
    id_cat INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre_cat VARCHAR(100) NOT NULL
  );
  `;
  
  tablaUsuario: string = `
  CREATE TABLE IF NOT EXISTS usuario (
    id_user INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre_user VARCHAR(100) NOT NULL, 
    apellido_user VARCHAR(100) NOT NULL, 
    correo_user VARCHAR(100) NOT NULL, 
    clave_user VARCHAR(100) NOT NULL, 
    telefono_user INTEGER NOT NULL, 
    id_rol INTEGER, 
    FOREIGN KEY (id_rol) REFERENCES rol(id_rol)
  );
  `;
  
  tablaProducto: string = `
  CREATE TABLE IF NOT EXISTS producto (
    id_prod INTEGER PRIMARY KEY AUTOINCREMENT, 
    nombre_prod VARCHAR(100) NOT NULL, 
    descripcion_prod VARCHAR(200) NOT NULL, 
    foto_prod BLOB NOT NULL, 
    precio_prod DECIMAL(10,2) NOT NULL, 
    stock_prod INTEGER NOT NULL, 
    id_cat INTEGER, 
    FOREIGN KEY (id_cat) REFERENCES categoria(id_cat)
  );
  `;
  
  tablaCompra: string = `
  CREATE TABLE IF NOT EXISTS compra (
    id_compra INTEGER PRIMARY KEY AUTOINCREMENT, 
    v_venta DECIMAL(10, 2) NOT NULL, 
    id_user INTEGER, 
    total_compra DECIMAL(10, 2) NOT NULL, 
    FOREIGN KEY (id_user) REFERENCES usuario(id_user)
  );
  `;
  
  tablaDetalle: string = `
  CREATE TABLE IF NOT EXISTS detalle (
    id_detalle INTEGER PRIMARY KEY AUTOINCREMENT, 
    id_compra INTEGER, 
    id_prod INTEGER, 
    cantidad_detalle INTEGER NOT NULL, 
    subtotal_detalle DECIMAL(10, 2) NOT NULL, 
    FOREIGN KEY (id_compra) REFERENCES compra(id_compra), 
    FOREIGN KEY (id_prod) REFERENCES producto(id_prod)
  );
  `;

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController) {
    this.createBD();
   }


async presentAlert(titulo: string, msj:string) {
  const alert = await this.alertController.create({
    header: titulo,
    message: msj,
    buttons: ['OK'],
  });

  await alert.present();
}

 //función para crear la Base de Datos
 createBD(){
  //varificar si la plataforma esta disponible
  this.platform.ready().then(()=>{
    //crear la Base de Datos
    this.sqlite.create({
      name: 'novagames.db',
      location: 'default'
    }).then((db: SQLiteObject)=>{
      //capturar la conexion a la BD
      this.database = db;
      //llamamos a la función para crear las tablas
      this.crearTablas();
    }).catch(e=>{
      this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
    })
  })
 }

 async crearTablas() {
  try {
    // Mensaje de inicio de creación de tablas
    console.log('Iniciando la creación de tablas...');

    // Creación de las tablas
    await this.database.executeSql(this.tablaRol, []);
    console.log('Tabla Rol creada.');
    
    await this.database.executeSql(this.tablaCategoria, []);
    console.log('Tabla Categoria creada.');
    
    await this.database.executeSql(this.tablaUsuario, []);
    console.log('Tabla Usuario creada.');
    
    await this.database.executeSql(this.tablaProducto, []);
    console.log('Tabla Producto creada.');
    
    await this.database.executeSql(this.tablaCompra, []);
    console.log('Tabla Compra creada.');
    
    await this.database.executeSql(this.tablaDetalle, []);
    console.log('Tabla Detalle creada.');

    // Mostrar mensaje si todas las tablas se crean correctamente
    await this.presentAlert('Creación de Tablas', 'Todas las tablas se han creado correctamente.');

  } catch (e) {
    // Mostrar alerta en caso de error
    this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    console.error('Error al crear las tablas:', e);
  }
}

async verificarTablas(): Promise<string[]> {
  const tablasFaltantes: string[] = [];

  try {
    // Verificar si la tabla Rol existe
    const resultadoRol = await this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='rol';", []);
    if (resultadoRol.rows.length === 0) tablasFaltantes.push('rol');
    
    // Verificar si la tabla Categoria existe
    const resultadoCategoria = await this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='categoria';", []);
    if (resultadoCategoria.rows.length === 0) tablasFaltantes.push('categoria');
    
    // Verificar si la tabla Usuario existe
    const resultadoUsuario = await this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='usuario';", []);
    if (resultadoUsuario.rows.length === 0) tablasFaltantes.push('usuario');
    
    // Verificar si la tabla Producto existe
    const resultadoProducto = await this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='producto';", []);
    if (resultadoProducto.rows.length === 0) tablasFaltantes.push('producto');
    
    // Verificar si la tabla Compra existe
    const resultadoCompra = await this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='compra';", []);
    if (resultadoCompra.rows.length === 0) tablasFaltantes.push('compra');
    
    // Verificar si la tabla Detalle existe
    const resultadoDetalle = await this.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='detalle';", []);
    if (resultadoDetalle.rows.length === 0) tablasFaltantes.push('detalle');

    return tablasFaltantes;

  } catch (e) {
    console.error('Error al verificar las tablas:', e);
    this.presentAlert('Verificación de Tablas', 'Error al verificar las tablas: ' + JSON.stringify(e));
    return tablasFaltantes;
  }
}


}






