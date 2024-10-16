import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, first, Observable } from 'rxjs';
import { Usuario } from './usuario';

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

  listarusuario = new BehaviorSubject <Usuario[]>([]);

  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

//metodos para manipular los observables
fetchNoticias(): Observable<Usuario[]>{
  return this.listarusuario.asObservable();
}

dbState(){
  return this.isDBReady.asObservable();
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
    console.log('Iniciando la creación de tablas...');
    await this.database.executeSql(this.tablaRol, []);
    await this.database.executeSql(this.tablaCategoria, []);
    await this.database.executeSql(this.tablaUsuario, []);
    await this.database.executeSql(this.tablaProducto, []);
    await this.database.executeSql(this.tablaCompra, []);
    await this.database.executeSql(this.tablaDetalle, []);

    // Marcar la base de datos como lista
    this.isDBReady.next(true);

  } catch (e) {
    this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
    console.error('Error al crear las tablas:', e);
    this.isDBReady.next(false);
  }
}


// Método para verificar si el correo ya está registrado
async verificarUsuario(correo: string): Promise<boolean> {
  const sql = 'SELECT COUNT(*) as count FROM usuario WHERE correo_user = ?';
  const res = await this.database.executeSql(sql, [correo]);
  const count = res.rows.item(0).count;
  return count > 0; // Retorna true si el usuario está registrado
}

// Método para insertar un nuevo usuario
async insertarUsuario(usuario: Usuario): Promise<void> {
  const sql = 'INSERT INTO usuario (nombre_user, apellido_user, correo_user, clave_user, telefono_user) VALUES (?, ?, ?, ?, ?)';
  await this.database.executeSql(sql, [usuario.nombreuser, usuario.apellidouser, usuario.correo_user, usuario.clave_user, usuario.telefono_user]);

  await this.obtenerUsuarios();
} catch (error: any) {
  console.error('Error al insertar usuario:', error);
  this.presentAlert('Inserción de Usuario', 'Error al insertar el usuario: ' + JSON.stringify(error));
}


async obtenerUsuarios(): Promise<Usuario[]> {
  try {
    // Esperar hasta que la base de datos esté lista
    const dbReady = await this.isDBReady.pipe(first()).toPromise();
    if (!dbReady) {
      console.log('La base de datos no está lista todavía.');
      return [];
    }

    const sql = 'SELECT * FROM usuario';
    const res = await this.database.executeSql(sql, []);
    const usuarios: Usuario[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      const usuario = res.rows.item(i);
      usuarios.push({
        iduser: usuario.id_user,
        nombreuser: usuario.nombre_user,
        apellidouser: usuario.apellido_user,
        correo_user: usuario.correo_user,
        clave_user: usuario.clave_user,
        telefono_user: usuario.telefono_user,
      });
    }

    // Actualizar el BehaviorSubject
    this.listarusuario.next(usuarios);
    return usuarios;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    this.presentAlert('Error', 'Error al obtener usuarios registrados: ' + JSON.stringify(error));
    return []; // Retorna un arreglo vacío en caso de error
  }
}


 //muestra todos los usuarios registrados en administrador
 async login(correo: string, clave: string): Promise<any> {
  const sql = 'SELECT * FROM usuario WHERE correo_user = ? AND clave_user = ?';
  const res = await this.database.executeSql(sql, [correo, clave]);

  if (res.rows.length > 0) {
    const user = res.rows.item(0);
    // Verifica si el usuario es administrador (id_rol = 1)
    if (user.id_rol === 1) {
      return { success: true, isAdmin: true, user: user };
    } else {
      return { success: true, isAdmin: false, user: user };
    }
  } else {
    return { success: false };
  }
}


}






