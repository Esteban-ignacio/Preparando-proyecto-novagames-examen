import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  usuario: string = "";

  constructor(private router: Router) { }

  ngOnInit() {
  }
  irPagina(){
    //creamos nuestra variable de contexto
    let navigationextras: NavigationExtras = {
      state: {
        user: this.usuario
      }
    }
    //Puedo crear cualquier logica de programación
    this.router.navigate(['/home'], navigationextras);
  }
  
  irRegistro(){
    let navigationextras: NavigationExtras={
    }
    this.router.navigate(['/registro'], navigationextras);
  }

  irRecuperar(){
    let navigationextras: NavigationExtras={
    }
    this.router.navigate(['/recuperarclave'], navigationextras);
  }
}
