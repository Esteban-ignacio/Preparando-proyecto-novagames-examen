import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Datoslogin, Extraerdatosusuario, Roles, Usuario, Verificarcorreo } from './usuario';
import { Productos } from './productos';


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

  listadatoslogin = new BehaviorSubject <Datoslogin[]>([]);

  listaverificarcorreo = new BehaviorSubject <Verificarcorreo[]>([]);

  listaroles = new BehaviorSubject <Roles[]>([]);

  listaextraerdatosusuario = new BehaviorSubject <Extraerdatosusuario[]>([]);

  listaobtenerproductos = new BehaviorSubject <Productos[]>([]);

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
fetchUsuarios(): Observable<Usuario[]>{
  return this.listarusuario.asObservable();
}

fetchDatoslogin(): Observable<Datoslogin[]>{
  return this.listadatoslogin.asObservable();
}

fetchVerificarcorreo(): Observable<Verificarcorreo[]>{
  return this.listaverificarcorreo.asObservable();
}

fetchRoles(): Observable<Roles[]>{
  return this.listaroles.asObservable();
}

fetchExtraerdatosusuario(): Observable<Extraerdatosusuario[]>{
  return this.listaextraerdatosusuario.asObservable();
}

fetchProductos(): Observable<Productos[]>{
  return this.listaobtenerproductos.asObservable();
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
async verificarUsuario(correo: string, telefono: string): Promise<{ emailExists: boolean; phoneExists: boolean }> {
  const sqlEmail = 'SELECT COUNT(*) as count FROM usuario WHERE correo_user = ?';
  const sqlPhone = 'SELECT COUNT(*) as count FROM usuario WHERE telefono_user = ?';
  
  const resEmail = await this.database.executeSql(sqlEmail, [correo]);
  const resPhone = await this.database.executeSql(sqlPhone, [telefono]);
  
  const emailExists = resEmail.rows.item(0).count > 0;
  const phoneExists = resPhone.rows.item(0).count > 0;

  // Emitir el resultado a través del BehaviorSubject
  const verificarCorreo: Verificarcorreo[] = [{ correoenregistro: correo, telefonoenregistro: telefono }];
  this.listaverificarcorreo.next(verificarCorreo); // Actualiza el observable

  return { emailExists, phoneExists }; // Retorna si el correo y teléfono existen
}



// Método para insertar un nuevo usuario en la pagina de registro
async insertarUsuario(usuario: Usuario): Promise<void> {
  try {
    const sql = 'INSERT INTO usuario (nombre_user, apellido_user, correo_user, clave_user, telefono_user) VALUES (?, ?, ?, ?, ?)';
    await this.database.executeSql(sql, [
      usuario.nombreuser, usuario.apellidouser, usuario.correo_user, usuario.clave_user, usuario.telefono_user
    ]);
    await this.obtenerUsuarios(); // Refrescar la lista de usuarios

    // Llamar al método para transferir datos al perfil
    await this.transferirDatosPerfil(usuario.correo_user); // Pasar el correo del nuevo usuario
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    this.presentAlert('Error', 'Error al insertar el usuario: ' + JSON.stringify(error));
  }
}


//obtiene los usuarios en la pagina de admin
async obtenerUsuarios(): Promise<Usuario[]> {
  try {
    const res = await this.database.executeSql('SELECT * FROM usuario', []);
    const items: Usuario[] = [];

    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          iduser: res.rows.item(i).id_user,
          nombreuser: res.rows.item(i).nombre_user,
          apellidouser: res.rows.item(i).apellido_user,
          correo_user: res.rows.item(i).correo_user,
          clave_user: res.rows.item(i).clave_user,
          telefono_user: res.rows.item(i).telefono_user
        });
      }
    }
    this.listarusuario.next(items); // Actualizar el observable con la lista de usuarios
    return items;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    this.presentAlert('Error', 'Error al obtener los usuarios: ' + JSON.stringify(error));
    return [];
  }
}

//para el login
async obtenerRoles(): Promise<void> {
  try {
    const res = await this.database.executeSql('SELECT * FROM rol', []);
    const roles: Roles[] = [];

    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        roles.push({
          idrol: res.rows.item(i).id_rol,
          nombrerol: res.rows.item(i).nombre_rol,
        });
      }
    }
    this.listaroles.next(roles); // Emitir los roles al observable
  } catch (error) {
    console.error('Error al obtener roles:', error);
  }
}


actualizarDatoslogin(datos: Datoslogin[]) {
  this.listadatoslogin.next(datos); // Actualiza los datos en el observable
}

async transferirDatosPerfil(correo: string): Promise<void> {
  try {
    // Obtener datos del usuario por correo
    const sql = 'SELECT * FROM usuario WHERE correo_user = ?';
    const res = await this.database.executeSql(sql, [correo]);

    if (res.rows.length > 0) {
      const user = res.rows.item(0);

      // Crear objeto de datos del perfil
      const datosPerfil: Extraerdatosusuario = {
        iduser: user.id_user,
        nombreuser: user.nombre_user,
        apellidouser: user.apellido_user,
        correo_user: user.correo_user,
        clave_user: user.clave_user,
        telefono_user: user.telefono_user,
      };

      // Actualiza el observable con los datos extraídos
      this.listaextraerdatosusuario.next([datosPerfil]);
    }
  } catch (error) {
    console.error('Error al transferir datos al perfil:', error);
    this.presentAlert('Error', 'Error al transferir datos al perfil: ' + JSON.stringify(error));
  }
}

async actualizarUsuario(usuario: Extraerdatosusuario): Promise<void> {
  const sql = 'UPDATE usuario SET nombre_user = ?, apellido_user = ?, telefono_user = ? WHERE correo_user = ?';

  try {
    const res = await this.database.executeSql(sql, [
      usuario.nombreuser,
      usuario.apellidouser,
      usuario.telefono_user,
      usuario.correo_user
    ]);

    // Validar si se actualizaron filas
    if (res.rowsAffected > 0) {
      console.log('Usuario actualizado correctamente.');

      // Después de actualizar, vuelve a obtener los datos para actualizar el observable
      await this.transferirDatosPerfil(usuario.correo_user);
      await this.obtenerUsuarios(); // Actualiza la lista de usuarios en el administrador
    } else {
      console.warn('No se encontró un usuario con el correo especificado.');
      this.presentAlert('Advertencia', 'No se encontró el usuario para actualizar. Asegúrate de que el correo esté correcto.');
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    this.presentAlert('Error', 'Error al actualizar los datos del usuario: ' + JSON.stringify(error));
  }
}

async actualizarClaveUsuario(correo: string, nuevaClave: string): Promise<void> {
  const sql = 'UPDATE usuario SET clave_user = ? WHERE correo_user = ?';

  try {
    const res = await this.database.executeSql(sql, [nuevaClave, correo]);

    // Validar si se actualizaron filas
    if (res.rowsAffected > 0) {
      console.log('Contraseña actualizada correctamente.');

      // Llama a transferirDatosPerfil para actualizar el observable y reflejar los cambios en el perfil
      await this.transferirDatosPerfil(correo);
      await this.obtenerUsuarios(); // Actualiza la lista de usuarios en el administrador
    } else {
      console.warn('No se encontró un usuario con el correo especificado.');
      this.presentAlert('Advertencia', 'No se encontró el usuario para actualizar la contraseña.');
    }
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    this.presentAlert('Error', 'No se pudo actualizar la contraseña: ' + JSON.stringify(error));
  }
}


//verifica si el usuario o admin ya esta registrado en la bd, esto a traves de si coincide su nombre, correo y contraseña
// Método de login modificado para incluir la transferencia de datos al perfil
async login(nombre: string, correo: string, clave: string): Promise<any> {
  const sql = 'SELECT * FROM usuario WHERE nombre_user = ? AND correo_user = ? AND clave_user = ?';
  const res = await this.database.executeSql(sql, [nombre, correo, clave]);

  if (res.rows.length > 0) {
    const user = res.rows.item(0);

    // Crear objeto Datoslogin y emitir por el observable
    const datosLogin: Datoslogin = {
      nombrelogin: user.nombre_user,
      correologin: user.correo_user,
      contrasenalogin: '' // No se guarda la contraseña por seguridad
    };
    this.actualizarDatoslogin([datosLogin]);

    const isAdmin = user.id_rol === 1;
    
    // Llamar a la función para transferir datos al perfil
    await this.transferirDatosPerfil(correo); // Transferir datos al perfil después de login

    return { success: true, isAdmin: isAdmin, user: user };
  } else {
    this.actualizarDatoslogin([]); // Emitir vacío si no hay usuario
    return { success: false };
  }
}

async verificarCorreoenrecuperarcontra(correo: string): Promise<boolean> {
  const sqlEmail = 'SELECT COUNT(*) as count FROM usuario WHERE correo_user = ?';
  
  const resEmail = await this.database.executeSql(sqlEmail, [correo]);
  
  return resEmail.rows.item(0).count > 0; // Retorna true si el correo existe
}

// Método para eliminar un usuario por su correo
async eliminarUsuario(correo: string): Promise<void> {
  try {
    const sql = 'DELETE FROM usuario WHERE correo_user = ?';
    const res = await this.database.executeSql(sql, [correo]);

    if (res.rowsAffected > 0) {
      console.log('Usuario eliminado correctamente.');
      await this.obtenerUsuarios(); // Actualiza la lista de usuarios después de eliminar
    } else {
      // Rechaza la promesa si no se encontró el usuario
      throw new Error('Este correo no se ha encontrado.'); // Mensaje personalizado
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    throw new Error('Error al eliminar el usuario: ' + JSON.stringify(error));
  }
}

async obtenerProductos(): Promise<Productos[]> {
  try {
    const res = await this.database.executeSql('SELECT id_prod, nombre_prod, precio_prod FROM producto', []);
    const items: Productos[] = [];

    if (res.rows.length > 0) {
      for (let i = 0; i < res.rows.length; i++) {
        items.push({
          id_prod: res.rows.item(i).id_prod,
          nombre: res.rows.item(i).nombre_prod,
          precio: res.rows.item(i).precio_prod
        });
      }
    }

    return items; // Devuelve los productos obtenidos
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return [];
  }
}

// En tu servicio ServiceBDService
async agregarProducto(producto: Productos): Promise<void> {
  try {
    await this.database.executeSql('INSERT INTO carrito (nombre, precio) VALUES (?, ?)', [producto.nombre, producto.precio]);
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    throw error; // Permite que el error sea manejado en la llamada
  }
}



async obtenerProductosDesdeCarrito(): Promise<Productos[]> {
  try {
    const res = await this.database.executeSql('SELECT * FROM carrito', []);
    const items: Productos[] = [];

    for (let i = 0; i < res.rows.length; i++) {
      items.push({
        id_prod: res.rows.item(i).id_prod, // Asegúrate de que la estructura de tu objeto sea correcta
        nombre: res.rows.item(i).nombre,    // Cambia según la estructura de tu tabla
        precio: res.rows.item(i).precio,    // Cambia según la estructura de tu tabla
      });
    }
    
    return items;
  } catch (error) {
    console.error('Error al obtener productos del carrito:', error);
    throw error; // Permite manejar el error en la llamada
  }
}


}






