import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  Nombre: string = "";

  alertButtons = ['Listo'];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  irHome(){
    let navigationextras: NavigationExtras = {

      }   
    this.router.navigate(['/home'], navigationextras);
    }

  irPerfil(){
    let navigationextras: NavigationExtras = {
      state: {
        nomb: this.Nombre
      }
    }
    this.router.navigate(['/perfil'], navigationextras);
  
    }
}
