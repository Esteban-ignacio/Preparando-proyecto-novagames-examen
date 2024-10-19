import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  nombre: string = "";
  apellido: string = "";
  correo: string = "";
  telefono: string = "";
  contrasena: string = "";

  constructor(private router: Router) { 
    
  }
  

  ngOnInit() {
  }
  Home(){
    let navigationextras: NavigationExtras = {

    }
    this.router.navigate(['/home'], navigationextras);
  }
  modificarperfil(){
    let navigationextras: NavigationExtras = {

    }
    this.router.navigate(['/modificarperfil'], navigationextras);
  }
}
