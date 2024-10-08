import { Injectable } from '@angular/core';
import { SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class ServiceBDService {
  //variable de conexion a la BD
  public database!: SQLiteObject;

  constructor() { }
}

