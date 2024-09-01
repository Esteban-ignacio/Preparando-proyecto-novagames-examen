import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  nombre: string = "";

  constructor(private router:Router, private activerouter: ActivatedRoute) { 
    this.activerouter.queryParams.subscribe(param =>{
      if(this.router.getCurrentNavigation()?.extras.state){
        this.nombre =  this.router.getCurrentNavigation()?.extras?.state?.['nomb'];
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

}
