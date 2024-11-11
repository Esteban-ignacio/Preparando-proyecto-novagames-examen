import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Correousuario, Datoslogin, Extraerdatosusuario, Roles, Usuario, Verificarcorreo } from './usuario';
import { Productos } from './productos';
import { HttpClient } from '@angular/common/http';


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
    foto_prod TEXT NOT NULL, 
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

  listaobtenercorreousuario = new BehaviorSubject <Correousuario[]>([]);

  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private apiUrl = 'https://mindicador.cl/api';

  constructor(private sqlite: SQLite, private platform: Platform, private alertController: AlertController, private http: HttpClient) {
    this.createBD();
   }

   // Método para obtener el valor del dólar, peso chileno y UF
  obtenerIndicadores(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
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

fetchCorreousuario(): Observable<Correousuario[]>{
  return this.listaobtenercorreousuario.asObservable();
}

dbState(){
  return this.isDBReady.asObservable();
}

//función para crear la Base de Datos
createBD() {
  // Verificar si la plataforma está disponible
  this.platform.ready().then(() => {
    // Crear la Base de Datos
    this.sqlite.create({
      name: 'novagames.db',
      location: 'default'
    }).then((db: SQLiteObject) => {
      // Capturar la conexión a la BD
      this.database = db;
      // Llamamos a la función para crear las tablas y luego verificar columnas
      this.crearTablas().then(() => {
        // Llamar a la verificación de columnas después de crear las tablas
        this.verificarColumnas();
      });
    }).catch(e => {
      this.presentAlert('Base de Datos', 'Error en crear la BD: ' + JSON.stringify(e));
    });
  });
}

// Función para crear tablas con retorno de promesa
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

// Función para verificar si la columna 'id_user' ya existe en la tabla 'detalle'
verificarColumnas() {
  const verificarSQL = "PRAGMA table_info(detalle);";
  
  this.database.executeSql(verificarSQL, []).then((result) => {
    const columnaExiste = Array.from({ length: result.rows.length }, (_, i) => result.rows.item(i))
                               .some(row => row.name === 'id_user');
    
    if (!columnaExiste) {
      // Si no existe la columna 'id_user', la agregamos
      const alterTableSQL = "ALTER TABLE detalle ADD COLUMN id_user INTEGER;";
      
      this.database.executeSql(alterTableSQL, []).then(() => {
        console.log("Columna 'id_user' añadida exitosamente a la tabla 'detalle'");
      }).catch(e => {
        this.presentAlert('Base de Datos', 'Error al añadir la columna id_user: ' + JSON.stringify(e));
      });
    } else {
      console.log("La columna 'id_user' ya existe en la tabla 'detalle'");
    }
  }).catch(e => {
    this.presentAlert('Base de Datos', 'Error al verificar columnas en detalle: ' + JSON.stringify(e));
  });
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

 // Función para obtener productos utilizando el correo del usuario desde el BehaviorSubject
 async obtenerProductos(): Promise<void> {
  // Obtener correo desde BehaviorSubject
  const correoUsuario = this.listaobtenercorreousuario.getValue()[0]?.correo_usuario;

  if (!correoUsuario) {
    this.presentAlert('Error', 'No se encontró el correo del usuario.');
    return;
  }

  try {
    // Consultar productos y sus cantidades desde la base de datos, filtrando por el correo
    const sql = `
      SELECT p.id_prod, p.nombre_prod, p.descripcion_prod, p.foto_prod, p.precio_prod, p.stock_prod, d.cantidad_detalle
      FROM producto p
      LEFT JOIN detalle d ON p.id_prod = d.id_prod
      LEFT JOIN usuario u ON d.id_user = u.id_user
      WHERE u.correo_user = ?  -- Filtramos por el correo del usuario
    `;
    const result = await this.database.executeSql(sql, [correoUsuario]);
    
    const productos: Productos[] = [];
    for (let i = 0; i < result.rows.length; i++) {
      const item = result.rows.item(i);
      // Instanciar el producto con los datos obtenidos
      productos.push(new Productos(
        item.id_prod,
        item.nombre_prod,
        item.descripcion_prod,
        item.foto_prod,
        item.precio_prod,
        item.stock_prod,
        item.cantidad_detalle || 0  // Aseguramos que la cantidad no sea null
      ));
    }

    // Actualizamos el BehaviorSubject con los productos obtenidos
    this.listaobtenerproductos.next(productos);
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    this.presentAlert('Error', 'Error al obtener los productos: ' + JSON.stringify(error));
  }
}

// Función para guardar un producto y asociarlo con el usuario, usando el correo del usuario desde el BehaviorSubject
async guardarProducto(producto: Productos, cantidad: number): Promise<void> {
  // Obtener correo desde el BehaviorSubject o lista de usuarios
  const correoUsuario = this.listaobtenercorreousuario.getValue()[0]?.correo_usuario;

  if (!correoUsuario) {
    this.presentAlert('Error', 'No se encontró el correo del usuario.');
    return;
  }

  try {
    // Consultar el idUsuario directamente a partir del correo
    const sqlUsuario = 'SELECT id_user FROM usuario WHERE correo_user = ?';
    const resultUsuario = await this.database.executeSql(sqlUsuario, [correoUsuario]);
    const idUsuario = resultUsuario.rows.length > 0 ? resultUsuario.rows.item(0).id_user : null;
    
    if (idUsuario === null) {
      this.presentAlert('Error', 'No se encontró el usuario con el correo proporcionado.');
      return;
    }

    // Insertar el producto en la tabla 'producto' si aún no existe
    const sqlProducto = `INSERT INTO producto (nombre_prod, descripcion_prod, foto_prod, precio_prod, stock_prod)
                         VALUES (?, ?, ?, ?, ?)`;
    await this.database.executeSql(sqlProducto, [
      producto.nombre,
      producto.descripcion,
      producto.imagen_prod,
      producto.precio,
      producto.stock
    ]);

    // Obtener el ID del producto recién insertado
    const sqlLastInsertId = 'SELECT last_insert_rowid() as id';
    const result = await this.database.executeSql(sqlLastInsertId, []);
    const idProducto = result.rows.item(0).id;

    // Insertar la cantidad del producto en la tabla 'detalle', asociando el producto con el usuario
    const sqlDetalle = 'INSERT INTO detalle (id_prod, id_user, cantidad_detalle, subtotal_detalle) VALUES (?, ?, ?, ?)';
    const subtotal = producto.precio * cantidad; // Calculamos el subtotal
    await this.database.executeSql(sqlDetalle, [idProducto, idUsuario, cantidad, subtotal]);

    // Refrescar la lista de productos después de la inserción
    await this.obtenerProductos(); // Obtener productos actualizados
  } catch (error) {
    console.error('Error al guardar el producto:', error);
    this.presentAlert('Error', 'Error al guardar el producto: ' + JSON.stringify(error));
  }
}

// Obtiene los correos de los usuarios
async obtenerCorreoUsuario(correo: string): Promise<void> {
  try {
    // Hacemos la verificación usando la base de datos local (si usas fetch para API, cambia esto)
    const sql = 'SELECT correo_user FROM usuario WHERE correo_user = ?';
    const result = await this.database.executeSql(sql, [correo]);

    if (result.rows.length === 0) {
      // Si no se encuentra el correo en la base de datos, retornamos null
      this.presentAlert('Error', 'El correo no existe en la base de datos.');
      this.listaobtenercorreousuario.next([]);  // Emitir un array vacío cuando no hay correo
      return;
    }

    // Si el correo existe, lo devolvemos y lo emitimos a través del BehaviorSubject
    const usuario = result.rows.item(0);
    const correoUsuario = usuario.correo_user;

    // Emitir el correo a través del observable
    this.listaobtenercorreousuario.next([{ correo_usuario: correoUsuario }]);

    console.log('Correo del usuario:', correoUsuario);  // Solo para verificación
  } catch (error) {
    console.error('Error al obtener el correo del usuario:', error);
    this.presentAlert('Error', 'Hubo un problema al obtener el correo del usuario.');
    this.listaobtenercorreousuario.next([]);  // Emitir un array vacío en caso de error
  }
}

//eliminar los productos que se muestran en el carrito una vez se cierra sesion
async limpiarCarrito(): Promise<void> {
  try {
    // Eliminar todos los productos del carrito (tabla detalle)
    const sql = 'DELETE FROM detalle';
    await this.database.executeSql(sql, []);

    // Actualizar el estado del carrito (vaciar el BehaviorSubject)
    this.listaobtenerproductos.next([]);  // Actualiza el carrito a vacío

    console.log('Carrito limpiado exitosamente');
  } catch (error) {
    console.error('Error al limpiar el carrito:', error);
  }
}

// Función para obtener los productos del carrito desde localStorage
obtenerCarrito(): Productos[] {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

// Función para agregar o actualizar un producto en el carrito
agregarProducto(producto: Productos): void {
  let carrito = this.obtenerCarrito();

  // Verifica si el producto ya existe en el carrito
  const index = carrito.findIndex(p => p.id_prod === producto.id_prod);
  if (index !== -1) {
    // Si el producto existe, solo actualizamos la cantidad
    carrito[index].cantidad = producto.cantidad;
  } else {
    // Si no existe, agregamos el producto al carrito con la cantidad actual
    carrito.push(producto);
  }

  // Guardamos el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para obtener la cantidad total de productos en el carrito
obtenerCantidadTotal(): number {
  const carrito = this.obtenerCarrito();
  return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para eliminar un producto del carrito
async eliminarProductoDelCarrito(producto: Productos): Promise<void> {
  // Obtener el correo del usuario desde el BehaviorSubject
  const correoUsuario = this.listaobtenercorreousuario.getValue()[0]?.correo_usuario;

  if (!correoUsuario) {
    this.presentAlert('Error', 'No se encontró el correo del usuario.');
    return;
  }

  try {
    // Consultar el id del usuario a partir del correo
    const sqlUsuario = 'SELECT id_user FROM usuario WHERE correo_user = ?';
    const resultUsuario = await this.database.executeSql(sqlUsuario, [correoUsuario]);
    const idUsuario = resultUsuario.rows.length > 0 ? resultUsuario.rows.item(0).id_user : null;

    if (idUsuario === null) {
      this.presentAlert('Error', 'No se encontró el usuario con el correo proporcionado.');
      return;
    }

    // Eliminar la relación del producto con el usuario en la tabla 'detalle'
    const sqlEliminarDetalle = 'DELETE FROM detalle WHERE id_prod = ? AND id_user = ?';
    await this.database.executeSql(sqlEliminarDetalle, [producto.id_prod, idUsuario]);

    // Refrescar la lista de productos después de eliminar
    await this.obtenerProductos(); // Obtener productos actualizados

    this.presentAlert('Éxito', 'Producto eliminado del carrito correctamente.');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    this.presentAlert('Error', 'Error al eliminar el producto: ' + JSON.stringify(error));
  }
}


}






