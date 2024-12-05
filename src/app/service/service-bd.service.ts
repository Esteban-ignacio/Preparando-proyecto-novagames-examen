import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { Correousuario, Datoslogin, Extraerdatosusuario, Roles, Usuario, Verificarcorreo } from './usuario';
import { Productos } from './productos';
import { HttpClient } from '@angular/common/http';
import { Compra } from './compra';



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

  listaobtenercorreousuario = new BehaviorSubject <Correousuario[]>([]);

  listacompras = new BehaviorSubject <Compra[]>([]);

  listaventasadmin = new BehaviorSubject<any[]>([]);

  //variable para el status de la Base de datos
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private apiUrl = 'https://mindicador.cl/api';

  contarproductosguardados: number = 0; // Propiedad para almacenar el contador de productos guardados

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

fetchCorreousuario(): Observable<Correousuario[]>{
  return this.listaobtenercorreousuario.asObservable();
}

fetchCompra(): Observable<Compra[]>{
  return this.listacompras.asObservable();
}

fetchVentas(): Observable<any[]> {
  return this.listaventasadmin.asObservable(); 
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
        this.verificarColumnasCompra();
        this.verificarColumnasUsuario();
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

    // Insertar los roles después de crear las tablas
    await this.insertarRoles();
    await this.insertarCategorias(); // Insertar categorías
    await this.insertarProductos(); // Aquí se insertan los productos

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

// Función para verificar si las columnas 'fecha_compra' y 'correo_usuario' ya existen en la tabla 'compra'
verificarColumnasCompra() {
  const verificarSQL = "PRAGMA table_info(compra);";

  this.database.executeSql(verificarSQL, []).then((result) => {
    // Verificamos si la columna 'fecha_compra' ya existe
    const columnaFechaCompraExiste = Array.from({ length: result.rows.length }, (_, i) => result.rows.item(i))
                                           .some(row => row.name === 'fecha_compra');

    // Verificamos si la columna 'correo_usuario' ya existe
    const columnaCorreoUsuarioExiste = Array.from({ length: result.rows.length }, (_, i) => result.rows.item(i))
                                             .some(row => row.name === 'correo_usuario');

    // Si 'fecha_compra' no existe, la añadimos
    if (!columnaFechaCompraExiste) {
      const alterTableFechaCompraSQL = "ALTER TABLE compra ADD COLUMN fecha_compra TEXT;";
      this.database.executeSql(alterTableFechaCompraSQL, []).then(() => {
        console.log("Columna 'fecha_compra' añadida exitosamente a la tabla 'compra'");
      }).catch(e => {
        this.presentAlert('Base de Datos', 'Error al añadir la columna "fecha_compra": ' + JSON.stringify(e));
      });
    } else {
      console.log("La columna 'fecha_compra' ya existe en la tabla 'compra'");
    }

    // Si 'correo_usuario' no existe, la añadimos
    if (!columnaCorreoUsuarioExiste) {
      const alterTableCorreoUsuarioSQL = "ALTER TABLE compra ADD COLUMN correo_usuario VARCHAR(100);";
      this.database.executeSql(alterTableCorreoUsuarioSQL, []).then(() => {
        console.log("Columna 'correo_usuario' añadida exitosamente a la tabla 'compra'");
      }).catch(e => {
        this.presentAlert('Base de Datos', 'Error al añadir la columna "correo_usuario": ' + JSON.stringify(e));
      });
    } else {
      console.log("La columna 'correo_usuario' ya existe en la tabla 'compra'");
    }
  }).catch(e => {
    this.presentAlert('Base de Datos', 'Error al verificar columnas en "compra": ' + JSON.stringify(e));
  });
}

// Función para verificar si la columna 'imagen_user' ya existe en la tabla 'usuario'
verificarColumnasUsuario() {
  const verificarSQL = "PRAGMA table_info(usuario);";
  
  this.database.executeSql(verificarSQL, []).then((result) => {
    const columnaExiste = Array.from({ length: result.rows.length }, (_, i) => result.rows.item(i))
                               .some(row => row.name === 'imagen_user');
    
    if (!columnaExiste) {
      // Si no existe la columna 'imagen_user', la agregamos
      const alterTableSQL = "ALTER TABLE usuario ADD COLUMN imagen_user BLOB;";
      
      this.database.executeSql(alterTableSQL, []).then(() => {
        console.log("Columna 'imagen_user' añadida exitosamente a la tabla 'usuario'");
      }).catch(e => {
        this.presentAlert('Base de Datos', 'Error al añadir la columna imagen_user: ' + JSON.stringify(e));
      });
    } else {
      console.log("La columna 'imagen_user' ya existe en la tabla 'usuario'");
    }
  }).catch(e => {
    this.presentAlert('Base de Datos', 'Error al verificar columnas en usuario: ' + JSON.stringify(e));
  });
}

// Función para insertar categorías solo si no existen
async insertarCategorias() {
  try {
    const categorias = [
      { id_cat: 1, nombre_cat: 'Supervivencia' },
      { id_cat: 2, nombre_cat: 'Deportes' }
    ];

    // Verificar si ya existen categorías en la base de datos
    const resultadoCategoria = await this.database.executeSql('SELECT * FROM categoria LIMIT 1', []);
    
    if (resultadoCategoria.rows.length === 0) {  // Si no hay ninguna categoría
      // Insertar categorías solo si no hay ninguna en la tabla
      for (const categoria of categorias) {
        await this.database.executeSql('INSERT INTO categoria (id_cat, nombre_cat) VALUES (?, ?)', 
          [categoria.id_cat, categoria.nombre_cat]);
        console.log(`Categoría ${categoria.nombre_cat} insertada correctamente`);
      }
    } else {
      console.log('Las categorías ya existen. No se insertaron.');
    }

  } catch (e) {
    console.error('Error al insertar categorías:', e);
  }
}

// Función para insertar productos
async insertarProductos() {
  try {
    // Productos de PlayStation (que pertenecen a 'Supervivencia')
    const productosPlayStation = [
      {
        id_prod: 1,
        nombre_prod: 'APEX LEGENDS',
        precio_prod: 4000,
        stock_prod: 60,
        foto_prod: 'assets/img/imgplaystation/imagenapex.jfif',
        descripcion_prod: `En este juego, hasta 60 jugadores forman escuadrones de tres personas y compiten en un campo de batalla en constante 
                    reducción para ser el último equipo en pie. Los jugadores eligen entre varios personajes, conocidos como "Leyendas",
                    cada uno con habilidades únicas que pueden afectar el juego, como crear escudos, curar a compañeros, o rastrear enemigos.
                   ¡Todo esto desde primera persona!`,
        id_cat: 1 // Usar id_cat 1 para "Supervivencia"
      },
      {
        id_prod: 2,
        nombre_prod: 'FORTNITE',
        precio_prod: 4000,
        stock_prod: 60,
        foto_prod: 'assets/img/imgplaystation/imagenfornite.jpg',
        descripcion_prod: ` La experiencia más icónica de todos los battle royale tiene contenido nuevo constantemente y ofrece una gran variedad 
                     de modos de juego para todos los gustos y estilos.
                     Sé el último jugador de pie en el modo clásico de Batalla campal, construye estructuras para ganar ventaja sobre otros 
                     99 jugadores y logra conseguir una victoria campal.`,
        id_cat: 1 // Usar id_cat 1 para "Supervivencia"
      },
      {
        id_prod: 3,
        nombre_prod: 'CALL OF DUTTY WARZONE 2',
        precio_prod: 15000,
        stock_prod: 55,
        foto_prod: 'assets/img/imgplaystation/imagenwarzone.jpg',
        descripcion_prod: ` Es un videojuego battle royale en el que hasta 150 jugadores compiten en un gigantesco mapa para ser el último 
                     equipo en pie. Los jugadores buscan armas, equipos y recursos mientras se enfrentan a otros equipos y evitan un círculo 
                     de gas que reduce constantemente el área de juego.`,
        id_cat: 1 // Usar id_cat 1 para "Supervivencia"
      },
      {
        id_prod: 4,
        nombre_prod: 'PUBG: BATTLEGROUNDS',
        precio_prod: 5000,
        stock_prod: 45,
        foto_prod: 'assets/img/imgplaystation/imagenpubg.jpg',
        descripcion_prod: ` En este juego, hasta 100 jugadores se lanzan en paracaídas a una isla y compiten para ser el último en pie. Los jugadores deben 
                     explorar el entorno, buscar armas, vehículos y equipo, y sobrevivir en un mapa que se reduce gradualmente debido a una 
                    "zona azul" que daña a los que quedan fuera de ella.`,
        id_cat: 1 // Usar id_cat 1 para "Supervivencia"
      },
      {
        id_prod: 5,
        nombre_prod: 'WARFACE: CLUTCH',
        precio_prod: 10000,
        stock_prod: 50,
        foto_prod: 'assets/img/imgplaystation/imagenwarface.jpg',
        descripcion_prod: ` Este juego de disparos por equipos representa una evolución para la jugabilidad de los battle royale y sigue siento popular 
                     más de una década después de su lanzamiento.
                     Elige entre cinco clases únicas: Rifleman, Medic, SED, Engineer y Sniper, cada una con una acción especial, como reponer 
                     municiones o restaurar armadura.`,
        id_cat: 1 // Usar id_cat 1 para "Supervivencia"
      }
    ];

    // Productos de Xbox (que pertenecen a 'Deportes')
    const productosXbox = [
      {
        id_prod: 6,
        nombre_prod: 'FC 24',
        precio_prod: 30000,
        stock_prod: 55,
        foto_prod: 'assets/img/imgxbox/imagenfc24.jpg',
        descripcion_prod: `Sigue la tradición de simulación de fútbol con mejoras en jugabilidad, gráficos y modos de juego. Incluye ligas, clubes y 
                           jugadores licenciados, con modos populares como Ultimate Team, Carrera y Volta Football. EAFC 24 se destaca por su motor 
                           gráfico Hypermotion V, que ofrece movimientos más realistas, y la inclusión de equipos femeninos en Ultimate Team, proporcionando 
                           una experiencia de fútbol aún más diversa y auténtica.`,
        id_cat: 2 // Usar id_cat 2 para "Deportes"
      },
      {
        id_prod: 7,
        nombre_prod: 'NBA 2K24',
        precio_prod: 35000,
        stock_prod: 40,
        foto_prod: 'assets/img/imgxbox/imgnba.webp',
        descripcion_prod: `Arma tu equipo y vive el pasado, el presente y el futuro de la cultura del baloncesto en NBA 2K24. Disfruta de una experiencia 
                    auténtica con opciones personalizadas ilimitadas de MyPLAYER, en MyCAREER. Colecciona una gran variedad de leyendas y arma tu 
                    alineación ideal en MyTEAM. Revive tus épocas favoritas como GM o Comisionado en MyNBA. Siente una jugabilidad de próximo nivel y 
                    disfruta de visuales ultrarrealistas mientras juegas con tus equipos favoritos de la NBA y la WNBA en JUEGA AHORA.`,
        id_cat: 2 // Usar id_cat 2 para "Deportes"
      },
      {
        id_prod: 8,
        nombre_prod: 'GRAN TURISMO 7',
        precio_prod: 15000,
        stock_prod: 30,
        foto_prod: 'assets/img/imgxbox/imggranturismo.jpg',
        descripcion_prod: `Ya te guste competir, pilotar por diversión, coleccionar coches, optimizarlos, crear diseños o sacar fotografías, 
                           podrás encontrar tu trazada con esta increíble colección de modos de juego, que incluye algunos tan emblemáticos 
                           como Campaña GT, Arcade o Escuela de conducción.`,
        id_cat: 2 // Usar id_cat 2 para "Deportes"
      },
      {
        id_prod: 9,
        nombre_prod: 'PGA TOUR 2K23',
        precio_prod: 20000,
        stock_prod: 30,
        foto_prod: 'assets/img/imgxbox/imgpga.jpg',
        descripcion_prod:  `Adéntrate en el deporte del swing con el simulador de golf más realista que hay. Elige entre 14 profesionales jugables
                            masculinos y femeninos y disfruta de 20 campos reales, desde Quail Hollow hasta el Riviera Country Club.`,
        id_cat: 2 // Usar id_cat 2 para "Deportes"
      },
      {
        id_prod: 10,
        nombre_prod: 'EA SPORTS NHL 24',
        precio_prod: 10000,
        stock_prod: 25,
        foto_prod: 'assets/img/imgxbox/imgnhl.jpg',
        descripcion_prod:  `Entra en el hielo y disfruta de los bloqueos, los slapshots y las jugadas ofensivas de la NHL.
                            Siente el crujido de cada golpe con las físicas y animaciones mejoradas mientras el nuevo Exhaust Engine se centra en la presión 
                            que se acumula durante las jugadas ofensivas y pasando tiempo en la zona de ataque.`,
        id_cat: 2 // Usar id_cat 2 para "Deportes"
      }
      
    ];

    // Verificar si ya existen productos en la base de datos
    const resultadoProducto = await this.database.executeSql('SELECT * FROM producto LIMIT 1', []);
    
    if (resultadoProducto.rows.length === 0) {  // Si no hay ningún producto
      // Insertar productos de PlayStation
      for (const producto of productosPlayStation) {
        await this.database.executeSql('INSERT INTO producto (id_prod, nombre_prod, precio_prod, stock_prod, foto_prod, descripcion_prod, id_cat) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [producto.id_prod, producto.nombre_prod, producto.precio_prod, producto.stock_prod, producto.foto_prod, producto.descripcion_prod, producto.id_cat]);
      }

      // Insertar productos de Xbox
      for (const producto of productosXbox) {
        await this.database.executeSql('INSERT INTO producto (id_prod, nombre_prod, precio_prod, stock_prod, foto_prod, descripcion_prod, id_cat) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [producto.id_prod, producto.nombre_prod, producto.precio_prod, producto.stock_prod, producto.foto_prod, producto.descripcion_prod, producto.id_cat]);
      }
      
    } else {
      console.log('Los productos ya existen. No se insertaron.');
    }
  } catch (e) {
    console.error('Error al insertar productos:', e);
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

// Método para insertar un nuevo usuario en la página de registro
async insertarUsuario(usuario: Usuario): Promise<void> {
  try {
    const sql = 'INSERT INTO usuario (nombre_user, apellido_user, correo_user, clave_user, telefono_user, imagen_user) VALUES (?, ?, ?, ?, ?, ?)';

    // Verificar si la imagen existe antes de insertar
    if (!usuario.imagen_user) {
      await this.presentAlert('Advertencia', 'No se ha proporcionado una imagen de perfil.'); // Mostrar advertencia si no hay imagen
      return;
    }

    // Insertar los datos del usuario
    await this.database.executeSql(sql, [
      usuario.nombreuser, usuario.apellidouser, usuario.correo_user, usuario.clave_user, usuario.telefono_user, usuario.imagen_user
    ]);

    // Obtener el ID del último registro insertado
    const result = await this.database.executeSql('SELECT last_insert_rowid() AS id', []);
    const newUserId = result.rows.item(0).id;

    console.log('Nuevo ID de usuario insertado:', newUserId);

    // Verificar si se ha obtenido el ID correctamente
    if (newUserId) {
    } else {
      await this.presentAlert('Error', 'No se pudo obtener el ID del nuevo usuario.');
    }

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
          telefono_user: res.rows.item(i).telefono_user,
          imagen_user: res.rows.item(i).imagen_user // Recuperar la imagen (Blob) desde la base de datos
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

actualizarDatoslogin(datos: Datoslogin[]) {
  this.listadatoslogin.next(datos); // Actualiza los datos en el observable
}

async transferirDatosPerfil(correo: string): Promise<void> {
  try {
    const sql = 'SELECT * FROM usuario WHERE correo_user = ?';
    const res = await this.database.executeSql(sql, [correo]);

    if (res.rows.length > 0) {
      const user = res.rows.item(0);

      // Crear objeto de datos del perfil con la imagen incluida
      const datosPerfil: Extraerdatosusuario = {
        iduser: user.id_user,
        nombreuser: user.nombre_user,
        apellidouser: user.apellido_user,
        correo_user: user.correo_user,
        clave_user: user.clave_user,
        telefono_user: user.telefono_user,
        imagen_user: user.imagen_user // Incluir la imagen en los datos
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
  const sql = `
    UPDATE usuario 
    SET 
      nombre_user = ?, 
      apellido_user = ?, 
      telefono_user = ?, 
      imagen_user = ? 
    WHERE correo_user = ?
  `;

  try {
    const res = await this.database.executeSql(sql, [
      usuario.nombreuser,
      usuario.apellidouser,
      usuario.telefono_user,
      usuario.imagen_user, // Imagen incluida en los parámetros
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
      this.presentAlert(
        'Advertencia',
        'No se encontró el usuario para actualizar. Asegúrate de que el correo esté correcto.'
      );
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

 // Función para obtener productos desde el localstorage
async obtenerProductos(): Promise<void> {
  try {
    // Obtener los productos desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Procesar los productos obtenidos (por ejemplo, mostrarlos en consola o UI)
    console.log('Productos en el carrito:', carrito);

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    this.presentAlert('Error', 'Error al obtener los productos: ' + JSON.stringify(error));
  }
}

// Función para agregar un producto al carrito (en localstorage)
async guardarProducto(producto: Productos, cantidad: number): Promise<void> {
  try {
    // Obtener el carrito actual desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Verificar si el producto ya existe en el carrito
    const productoExistente = carrito.find((item: any) => item.id_prod === producto.id_prod);

    if (productoExistente) {
      // Si el producto ya está en el carrito, incrementar su cantidad
      productoExistente.cantidad_detalle += cantidad;
    } else {
      // Si no está, agregar el producto como una nueva entrada
      const productoConCantidad = { ...producto, cantidad_detalle: cantidad };
      carrito.push(productoConCantidad);

    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));

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

// Función para limpiar el carrito y las compras del usuario en sesión
async limpiarCarrito(): Promise<void> {
  try {
    // Eliminar todos los productos del carrito en localStorage
    localStorage.removeItem('carrito');
    console.log('Carrito limpiado exitosamente');

    // Limpiar las compras del usuario en sesión (quitar las compras en sesión, no eliminar de la base de datos)
    this.listacompras.next([]); // Esto limpia la lista de compras que está en memoria

    console.log('Compras del usuario en sesión eliminadas.');

  } catch (error) {
    console.error('Error al limpiar el carrito o las compras:', error);
  }
}

// Función para obtener los productos del carrito desde localStorage
obtenerCarrito(): Productos[] {
  const carrito = localStorage.getItem('carrito');
  return carrito ? JSON.parse(carrito) : [];
}

// Función para agregar o actualizar un producto en el carrito
agregarProducto(producto: Productos) {
  // Obtener el carrito actual
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  // Buscar si el producto ya existe en el carrito
  const productoExistente = carrito.find((item: Productos) => item.id_prod === producto.id_prod);

  if (productoExistente) {
    // Si el producto ya existe, sumamos la cantidad
    productoExistente.cantidad_detalle += producto.cantidad;
  } else {
    // Si el producto no existe, lo agregamos al carrito
    carrito.push(producto);
  }

  // Guardar el carrito actualizado en localStorage
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para obtener la cantidad total de productos en el carrito
obtenerCantidadTotal(): number {
  const carrito = this.obtenerCarrito();
  return carrito.reduce((total, producto) => total + producto.cantidad, 0);
}

// Función para eliminar un producto del carrito desde localStorage
async eliminarProductoDelCarrito(producto: Productos): Promise<void> {
  try {
    // Obtener el carrito actual desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Filtrar los productos, eliminando el producto seleccionado
    const carritoActualizado = carrito.filter((item: Productos) => item.id_prod !== producto.id_prod);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));

    // Refrescar la lista de productos del carrito
    await this.obtenerProductos(); // Obtener productos actualizados desde localStorage

    // Actualizar el contador de productos en el carrito
    this.cargarContadorProductos();

    this.presentAlert('Éxito', 'Producto eliminado del carrito correctamente.');
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    this.presentAlert('Error', 'Error al eliminar el producto: ' + JSON.stringify(error));
  }
}

// Función para eliminar un producto del carrito desde localStorage
async eliminarProductoDelacompra(producto: Productos): Promise<void> {
  try {
    // Obtener el carrito actual desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Filtrar los productos, eliminando el producto seleccionado
    const carritoActualizado = carrito.filter((item: Productos) => item.id_prod !== producto.id_prod);

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));

    // Refrescar la lista de productos del carrito
    await this.obtenerProductos(); // Obtener productos actualizados desde localStorage

    // Actualizar el contador de productos en el carrito
    this.cargarContadorProductos();

  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    this.presentAlert('Error', 'Error al eliminar el producto: ' + JSON.stringify(error));
  }
}

async guardarCompra(
  productos: Compra[],  // Usando la clase Compra directamente
  vVenta: number, 
  totalCompra: number,
  fechaCompra: string // Agregar el parámetro para la fecha de la compra
): Promise<boolean> { 
  try {
    // Obtener el correo del usuario desde el observable
    let correoUsuario: string | null = null;
    this.listadatoslogin.subscribe(datos => {
      if (datos.length > 0) {
        correoUsuario = datos[0]?.correologin; // Obtener el correo desde el observable
      }
    });

    // Verificar si se encontró el correo del usuario
    if (!correoUsuario) {
      throw new Error('No se ha encontrado tu correo en sesión. Asegúrate de estar logueado.');
    }

    // Obtener el id_user basado en el correo del usuario
    const resultadoIdUser = await this.database.executeSql(
      'SELECT id_user FROM usuario WHERE correo_user = ?',
      [correoUsuario]
    );

    const idUser = resultadoIdUser.rows.length > 0 ? resultadoIdUser.rows.item(0).id_user : null;

    if (!idUser) {
      throw new Error('No se encontró el usuario con ese correo.');
    }

    // Determinar el valor de la compra
    const valorCompra = productos.length === 1 ? vVenta : totalCompra;

    // Insertar la compra en la tabla 'compra' usando el id_user, la fecha de la compra y el correo del usuario
    const resCompra = await this.database.executeSql(
      'INSERT INTO compra (id_user, correo_usuario, total_compra, v_venta, fecha_compra) VALUES (?, ?, ?, ?, ?)', // Insertamos el correo_usuario también
      [idUser, correoUsuario, valorCompra, valorCompra, fechaCompra]
    );

    if (resCompra.insertId) {
      const idCompra = resCompra.insertId;

      // Insertar los detalles de la compra en la tabla 'detalle'
      for (const producto of productos) {
        // Validar que la cantidad del producto sea mayor a 0
        if (producto.cantidad <= 0 || !producto.cantidad) {
          const errorMessage = `La cantidad del producto con ID ${producto.id_prod} debe ser mayor que 0.`;
          console.error(errorMessage);
          this.presentAlert('Error en los detalles', errorMessage);
          return false;  // Retorna false en caso de error en la cantidad
        }

        try {
          await this.database.executeSql(
            'INSERT INTO detalle (id_compra, id_prod, cantidad_detalle, subtotal_detalle) VALUES (?, ?, ?, ?)',
            [
              idCompra,
              producto.id_prod,  // ID del producto
              producto.cantidad,  // Cantidad del producto
              producto.total_compra   // El total de la compra como subtotal
            ]
          );
        } catch (error: any) {
          console.error('Error al guardar el detalle del producto:', error);
          this.presentAlert('Error en los detalles', `Hubo un problema al guardar los detalles de los productos. Error: ${error.message || 'Desconocido'}`);
          return false;
        }
      }

      console.log('Compra y detalles guardados correctamente');
      this.presentAlert('Éxito', 'Compra procesada correctamente');

      // Llamar a la función obtenerCompras() para guardar las compras del usuario actual
      await this.obtenerCompras();
      // Llamar a la función obtenerVentasAdmin() para obtener todas las ventas de los administradores
      await this.obtenerVentasAdmin();
      return true;
    } else {
      throw new Error('No se pudo obtener el ID de la compra');
    }
  } catch (e: any) {
    console.error('Error al guardar la compra:', e);
    this.presentAlert('Error', 'Hubo un problema al procesar tu compra. Intenta nuevamente.');
    return false;
  }
}

async obtenerCompras(): Promise<void> {
  try {
    // Suscribirse a los datos del usuario en sesión para obtener el correo
    this.listadatoslogin.subscribe(async (datos) => {
      const correoUsuario = datos?.[0]?.correologin;

      if (!correoUsuario) {
        throw new Error('No se ha encontrado tu correo en sesión. Asegúrate de estar logueado.');
      }

      // Consultar las compras del usuario, filtrando por el correo_usuario
      const resultadoCompras = await this.database.executeSql(
        'SELECT * FROM compra WHERE correo_usuario = ?',
        [correoUsuario]
      );

      const compras: any[] = [];
      for (let i = 0; i < resultadoCompras.rows.length; i++) {
        const compra = resultadoCompras.rows.item(i);

        // Obtener la fecha de la compra
        const fechaCompra = compra.fecha_compra;

        // Obtener los detalles de la compra (productos y cantidades)
        const productosCompra: { id_prod: number, nombre_prod: string, foto_prod: string | null, cantidad: number, subtotal: number }[] = [];
        const resultadoDetalleCompra = await this.database.executeSql(
          'SELECT id_prod, cantidad_detalle AS cantidad, subtotal_detalle AS subtotal FROM detalle WHERE id_compra = ?',
          [compra.id_compra]
        );
        for (let j = 0; j < resultadoDetalleCompra.rows.length; j++) {
          const detalle = resultadoDetalleCompra.rows.item(j);
          
          // Obtener el nombre y foto del producto
          const resultadoProducto = await this.database.executeSql(
            'SELECT nombre_prod, foto_prod FROM producto WHERE id_prod = ?',
            [detalle.id_prod]
          );
          const producto = resultadoProducto.rows.length > 0 ? resultadoProducto.rows.item(0) : null;

          if (producto) {
            productosCompra.push({
              id_prod: detalle.id_prod,
              nombre_prod: producto.nombre_prod,
              foto_prod: producto.foto_prod,
              cantidad: detalle.cantidad,
              subtotal: detalle.subtotal
            });
          } else {
            // Alerta si no se encuentra el producto
            this.presentAlert(
              'Error al obtener producto',
              `No se encontró el producto con ID: ${detalle.id_prod}.`
            );
          }
        }

        compras.push({
          id_compra: compra.id_compra,
          total_compra: compra.total_compra,
          v_venta: compra.v_venta,
          correo_usuario: compra.correo_usuario, // Incluimos el correo guardado en la compra
          fecha_compra: fechaCompra, // Agregar la fecha de la compra
          productos: productosCompra // Agregar los productos de la compra
        });
      }

      // Actualizar la lista de compras
      this.listacompras.next(compras);
    }, (error) => {
      console.error('Error al obtener el correo del usuario:', error);
      this.presentAlert('Error', 'Hubo un problema al obtener los datos de sesión.');
    });
  } catch (error) {
    // Si el error es un objeto, extraemos el mensaje de error
    const mensajeError = error instanceof Error ? error.message : 'Hubo un problema inesperado.';
    console.error('Error al obtener las compras:', error);
    // Mostrar alerta con el mensaje específico
    this.presentAlert('Error', `Hubo un problema al obtener tus compras: ${mensajeError}. Intenta nuevamente.`);
  }
}

async obtenerVentasAdmin(): Promise<void> {
  try {
    // Consultar todas las compras de la tabla 'compra'
    const resultadoVentas = await this.database.executeSql(
      'SELECT * FROM compra', // Seleccionamos todas las compras
      []
    );

    const ventas: any[] = [];
    for (let i = 0; i < resultadoVentas.rows.length; i++) {
      const venta = resultadoVentas.rows.item(i);

      // Obtener los detalles de la compra (productos y cantidades)
      const productosVenta: { nombre_prod: string, cantidad: number, subtotal: number, foto_prod: string }[] = [];
      const resultadoDetalleVenta = await this.database.executeSql(
        'SELECT id_prod, cantidad_detalle AS cantidad, subtotal_detalle AS subtotal FROM detalle WHERE id_compra = ?',
        [venta.id_compra]
      );

      // Iterar sobre los detalles de la compra
      for (let j = 0; j < resultadoDetalleVenta.rows.length; j++) {
        const detalle = resultadoDetalleVenta.rows.item(j);

        // Obtener el nombre y la foto del producto
        const resultadoProducto = await this.database.executeSql(
          'SELECT nombre_prod, foto_prod FROM producto WHERE id_prod = ?',
          [detalle.id_prod]
        );
        const producto = resultadoProducto.rows.length > 0 ? resultadoProducto.rows.item(0) : null;

        if (producto) {
          productosVenta.push({
            nombre_prod: producto.nombre_prod,
            cantidad: detalle.cantidad,
            subtotal: detalle.subtotal,
            foto_prod: producto.foto_prod // Foto del producto
          });
        } else {
          // Alerta si no se encuentra el producto
          this.presentAlert(
            'Error al obtener producto',
            `No se encontró el producto con ID: ${detalle.id_prod}.`
          );
        }
      }

      // Agregar la venta con el correo asociado y los productos
      ventas.push({
        id_compra: venta.id_compra,
        total_compra: venta.total_compra,
        v_venta: venta.v_venta,
        correo_usuario: venta.correo_usuario, // Ahora el correo ya está en la tabla 'compra'
        fecha_compra: venta.fecha_compra, // Fecha de la compra
        productos: productosVenta // Productos asociados a la compra
      });
    }

    // Actualizar la lista de ventas para el administrador
    this.listaventasadmin.next(ventas);
  } catch (error) {
    // Si el error es un objeto, extraemos el mensaje de error
    const mensajeError = error instanceof Error ? error.message : 'Hubo un problema inesperado.';
    console.error('Error al obtener las ventas del admin:', error);
    // Mostrar alerta con el mensaje específico
    this.presentAlert('Error', `Hubo un problema al obtener las ventas: ${mensajeError}. Intenta nuevamente.`);
  }
}

// Función para cargar el contador de productos guardados
async cargarContadorProductos(): Promise<void> {
  const cantidadProductosGuardados = await this.contarProductosGuardados(); // Llama a la función que cuenta los productos guardados en la base de datos

  // Almacenar la cantidad de productos en la propiedad de clase
  this.contarproductosguardados = cantidadProductosGuardados;

  console.log('Cantidad de productos guardados:', this.contarproductosguardados);
}

// Función para contar los productos guardados para un usuario
async contarProductosGuardados(): Promise<number> {
  try {
    // Obtener los productos desde localStorage
    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    // Contar la cantidad de productos en el carrito
    const cantidadProductos = carrito.length;

    // Retornar la cantidad de productos en el carrito
    return cantidadProductos;
  } catch (error) {
    console.error('Error al contar los productos en el carrito:', error);
    this.presentAlert('Error', 'Error al contar los productos en el carrito: ' + JSON.stringify(error));
    return 0; // Si ocurre un error, retornamos 0
  }
}


// Nueva función para resetear el contador de productos en `localStorage`
resetearContadorProductos() {
  localStorage.removeItem('productosEnCarrito'); // Borra los productos del carrito
  localStorage.removeItem('productosGuardados'); // Borra el contador de productos
}

//elimina roles duplicados
async eliminarDuplicados() {
  try {
    // Consulta para eliminar los duplicados
    const sqlDeleteDuplicates = `
      DELETE FROM rol
      WHERE rowid NOT IN (
        SELECT MIN(rowid)
        FROM rol
        GROUP BY nombre_rol
      );
    `;
    await this.database.executeSql(sqlDeleteDuplicates, []);
    console.log('Duplicados eliminados correctamente');
  } catch (e) {
    console.error('Error al eliminar duplicados:', e);
  }
}

// Llama a esta función después de insertar los roles
async insertarRoles() {
  try {
    // Insertar los roles si no existen (como lo hiciste antes)
    const sqlCheckAdmin = 'SELECT * FROM rol WHERE nombre_rol = ?';
    const resAdmin = await this.database.executeSql(sqlCheckAdmin, ['administrador']);
    if (resAdmin.rows.length === 0) {
      const sqlAdmin = 'INSERT INTO rol (nombre_rol) VALUES (?)';
      await this.database.executeSql(sqlAdmin, ['administrador']);
    }

    const sqlCheckUser = 'SELECT * FROM rol WHERE nombre_rol = ?';
    const resUser = await this.database.executeSql(sqlCheckUser, ['usuario']);
    if (resUser.rows.length === 0) {
      const sqlUser = 'INSERT INTO rol (nombre_rol) VALUES (?)';
      await this.database.executeSql(sqlUser, ['usuario']);
    }

    // Eliminar duplicados después de insertar los roles
    await this.eliminarDuplicados();

    // Obtener los roles para actualizarlos en la interfaz
    await this.obtenerRoles();
  } catch (e) {
    this.presentAlert('Inserción de Roles', 'Error al insertar los roles: ' + JSON.stringify(e));
    console.error('Error al insertar roles:', e);
  }
}

// Función para obtener los roles desde la base de datos
async obtenerRoles() {
  try {
    const res = await this.database.executeSql('SELECT * FROM rol', []);
    const roles: Roles[] = [];
    
    // Verifica la respuesta y muestra los resultados obtenidos
    console.log('Respuesta de obtenerRoles:', res);
    
    for (let i = 0; i < res.rows.length; i++) {
      const rol = res.rows.item(i);
      console.log('Rol encontrado:', rol);  // Muestra cada rol que se obtiene de la base de datos
      roles.push({
        idrol: rol.id_rol,        // Asegúrate de que estás mapeando los valores correctamente
        nombrerol: rol.nombre_rol  // Aquí asignamos el nombre del rol
      });
    }
    
    // Actualiza el observable con los roles obtenidos
    this.listaroles.next(roles);
  } catch (e) {
    console.error('Error al obtener roles:', e);
  }
}

//para obtener los productos y la categoria de estos, que estan guardados en la base de datos.
async obtenerProductosParaAdmin() {
  try {
    // Realizar la consulta para obtener todos los productos junto con el nombre de la categoría
    const resultado = await this.database.executeSql(`
      SELECT p.id_prod, p.nombre_prod, p.precio_prod, p.stock_prod, p.foto_prod, p.descripcion_prod, p.id_cat, c.nombre_cat
      FROM producto p
      JOIN categoria c ON p.id_cat = c.id_cat
    `, []);

    const productos: any[] = []; // Array de tipo 'any' para almacenar los productos obtenidos

    // Iterar sobre los resultados y almacenarlos en un array
    for (let i = 0; i < resultado.rows.length; i++) {
      const producto = resultado.rows.item(i);  // Obtener cada producto de los resultados
      productos.push({
        id_prod: producto.id_prod,
        nombre_prod: producto.nombre_prod,
        precio_prod: producto.precio_prod,
        stock_prod: producto.stock_prod,
        foto_prod: producto.foto_prod,
        descripcion_prod: producto.descripcion_prod,
        id_cat: producto.id_cat,  // ID de la categoría
        nombre_cat: producto.nombre_cat  // Nombre de la categoría
      });
    }

    // Devolver los productos obtenidos
    return productos;

  } catch (error) {
    console.error('Error al obtener los productos:', error);
    // Mostrar una alerta si ocurre un error
    this.presentAlert('Error', 'Hubo un error al obtener los productos de la base de datos.');
    // Devolver un array vacío en caso de error para evitar problemas en el flujo de la aplicación
    return [];
  }
}

// Función para actualizar el stock de un producto por su ID
async actualizarStockProducto(id_prod: number, nuevoStock: number): Promise<void> {
  try {
    // Ejecutar la consulta SQL para actualizar el stock del producto con el ID especificado
    await this.database.executeSql(`
      UPDATE producto
      SET stock_prod = ?
      WHERE id_prod = ?
    `, [nuevoStock, id_prod]);

    // Confirmar que la actualización fue exitosa
    console.log(`Stock del producto con ID ${id_prod} actualizado a ${nuevoStock}`);

    // Mostrar una alerta de éxito si lo deseas
    this.presentAlert('Éxito', `El stock del producto ha sido actualizado a ${nuevoStock}`);
  } catch (error) {
    // Mostrar una alerta si ocurre un error
    console.error('Error al actualizar el stock:', error);
    this.presentAlert('Error', 'Hubo un error al actualizar el stock del producto.');
  }
}

async obtenerProductosPlayStation(): Promise<any[]> {
  try {
    // Consulta para obtener los productos de PlayStation de categoría supervivencia
    const resultado = await this.database.executeSql(`
      SELECT p.id_prod, p.nombre_prod, p.precio_prod, p.stock_prod, p.foto_prod, p.descripcion_prod, p.id_cat, c.nombre_cat
      FROM producto p
      JOIN categoria c ON p.id_cat = c.id_cat
      WHERE c.nombre_cat = 'Supervivencia' AND p.plataforma = 'PlayStation'
    `, []);

    const productos: any[] = [];

    // Iterar sobre los resultados y almacenarlos en un array
    for (let i = 0; i < resultado.rows.length; i++) {
      const producto = resultado.rows.item(i);
      productos.push({
        id_prod: producto.id_prod,
        nombre_prod: producto.nombre_prod,
        precio_prod: producto.precio_prod,
        stock_prod: producto.stock_prod,
        foto_prod: producto.foto_prod,
        descripcion_prod: producto.descripcion_prod,
        id_cat: producto.id_cat,
        nombre_cat: producto.nombre_cat,
      });
    }

    return productos;

  } catch (error) {
    console.error('Error al obtener los productos de PlayStation:', error);
    this.presentAlert('Error', 'Hubo un error al obtener los productos de PlayStation de la base de datos.');
    return [];
  }
}

async obtenerProductosXbox(): Promise<any[]> {
  try {
    // Consulta para obtener los productos de Xbox de categoría Deportes
    const resultado = await this.database.executeSql(`
      SELECT p.id_prod, p.nombre_prod, p.precio_prod, p.stock_prod, p.foto_prod, p.descripcion_prod, p.id_cat, c.nombre_cat
      FROM producto p
      JOIN categoria c ON p.id_cat = c.id_cat
      WHERE c.nombre_cat = 'Deportes' AND p.plataforma = 'Xbox'
    `, []);

    const productos: any[] = [];

    // Iterar sobre los resultados y almacenarlos en un array
    for (let i = 0; i < resultado.rows.length; i++) {
      const producto = resultado.rows.item(i);
      productos.push({
        id_prod: producto.id_prod,
        nombre_prod: producto.nombre_prod,
        precio_prod: producto.precio_prod,
        stock_prod: producto.stock_prod,
        foto_prod: producto.foto_prod,
        descripcion_prod: producto.descripcion_prod,
        id_cat: producto.id_cat,
        nombre_cat: producto.nombre_cat,
      });
    }

    return productos;

  } catch (error) {
    console.error('Error al obtener los productos de Xbox:', error);
    this.presentAlert('Error', 'Hubo un error al obtener los productos de Xbox de la base de datos.');
    return [];
  }
}

// Función para agregar stock a un producto por su ID
async agregarStockProducto(id_prod: number, stockAdicional: number): Promise<void> {
  try {
    // Primero, obtenemos el stock actual del producto
    const resultado = await this.database.executeSql(`
      SELECT stock_prod FROM producto WHERE id_prod = ?
    `, [id_prod]);

    if (resultado.rows.length > 0) {
      // Obtenemos el stock actual del producto
      const stockActual = resultado.rows.item(0).stock_prod;

      // Calculamos el nuevo stock sumando el stock adicional
      const nuevoStock = stockActual + stockAdicional;

      // Ejecutamos la actualización del stock en la base de datos
      await this.database.executeSql(`
        UPDATE producto
        SET stock_prod = ?
        WHERE id_prod = ?
      `, [nuevoStock, id_prod]);

      // Confirmar que la actualización fue exitosa
      console.log(`Stock del producto con ID ${id_prod} actualizado a ${nuevoStock}`);

      // Mostrar una alerta de éxito
      this.presentAlert('Éxito', `El stock del producto ha sido actualizado a ${nuevoStock}`);
    } else {
      // Si no se encuentra el producto con ese ID, mostrar un mensaje de error
      console.error(`Producto con ID ${id_prod} no encontrado.`);
      this.presentAlert('Error', 'Producto no encontrado.');
    }
  } catch (error) {
    // Mostrar una alerta si ocurre un error
    console.error('Error al agregar stock al producto:', error);
    this.presentAlert('Error', 'Hubo un error al agregar el stock al producto.');
  }
}

}






