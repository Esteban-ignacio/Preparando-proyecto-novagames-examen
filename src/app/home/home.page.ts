import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  Usuario: string = "";

  constructor(private router: Router, private activerouter: ActivatedRoute) {
    this.activerouter.queryParams.subscribe(() => {
      const navigation = this.router.getCurrentNavigation()?.extras?.state;
      if (navigation) {
        this.Usuario = navigation['user']; // Asigna el usuario recibido
        localStorage.setItem('Usuario', this.Usuario); // Guarda el usuario en localStorage
      }
    });
  }
  
  ngOnInit() {
    // Al cargar la página, verifica si ya existe un usuario en localStorage
    const storedUser = localStorage.getItem('Usuario');
    if (storedUser) {
      this.Usuario = storedUser; // Recupera el usuario del localStorage
    }
  }

  irPlaystation(){
    let navigationextras: NavigationExtras = {

    }
   
    this.router.navigate(['/playstation'], navigationextras);

  }

  irXbox(){
    let navigationextras: NavigationExtras = {

    }

    this.router.navigate(['/xbox'], navigationextras);
  }

}
