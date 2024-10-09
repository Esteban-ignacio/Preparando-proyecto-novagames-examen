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
  tablaRol: string = "CREATE TABLE IF NOT EXISTS rol(id_rol INTEGER PRIMARY KEY autoincrement, nombre_rol VARCHAR(100) NOT NULL);";

  tablaCategoria: string = "CREATE TABLE IF NOT EXISTS categoria(id_cat INTEGER PRIMARY KEY autoincrement, nombre_cat VARCHAR(100) NOT NULL);";

  tablaUsuario: string = "CREATE TABLE IF NOT EXISTS usuario(id_user INTEGER PRIMARY KEY autoincrement, nombre_user VARCHAR(100) NOT NULL, apellido_user VARCHAR(100) NOT NULL, correo_user VARCHAR(100) NOT NULL, clave_user VARCHAR(100) NOT NULL, telefono_user INTEGER NOT NULL, id_rol INTEGER FOREIGN KEY );";

  tablaProducto: string = "CREATE TABLE IF NOT EXISTS producto(id_prod INTEGER PRIMARY KEY autoincrement, nombre_prod VARCHAR(100) NOT NULL, descripcion_prod VARCHAR(200) NOT NULL, foto_prod BLOB NOT NULL, precio_prod DECIMAL(10,2) NOT NULL, stock_prod INTEGER NOT NULL, id_cat INTEGER FOREIGN KEY );";

  tablaCompra: string = "CREATE TABLE IF NOT EXISTS compra(id_compra INTEGER PRIMARY KEY autoincrement, v_venta DECIMAL(10, 2) NOT NULL, id_user INTEGER FOREIGN KEY , total_compra DECIMAL(10, 2) NOT NULL);";

  tablaDetalle: string = "CREATE TABLE IF NOT EXISTS detalle(id_detalle INTEGER PRIMARY KEY autoincrement, id_compra INTEGER FOREIGN KEY, id_prod INTEGER FOREIGN KEY , cantidad_detalle INTEGER NOT NULL, subtotal_detalle DECIMAL(10, 2) NOT NULL);";

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
      name: 'noticias.db',
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

 async crearTablas(){
  try{
    //ejecuto la creación de Tablas
    await this.database.executeSql(this.tablaRol, []);
    
  }catch(e){
    this.presentAlert('Creación de Tablas', 'Error en crear las tablas: ' + JSON.stringify(e));
  }
}




}






