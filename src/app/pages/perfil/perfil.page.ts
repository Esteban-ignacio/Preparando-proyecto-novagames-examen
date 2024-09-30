import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

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

  constructor(private router:Router, private activerouter: ActivatedRoute) { 
    this.activerouter.queryParams.subscribe(param =>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.nombre =  this.router.getCurrentNavigation()?.extras?.state?.['nomb'];
        this.apellido = this.router.getCurrentNavigation()?.extras?.state?.['ape'];
        this.correo = this.router.getCurrentNavigation()?.extras?.state?.['cor'];
        this.telefono = this.router.getCurrentNavigation()?.extras?.state?.['tel'];
        this.contrasena = this.router.getCurrentNavigation()?.extras?.state?.['cont'];
      }
    })
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
