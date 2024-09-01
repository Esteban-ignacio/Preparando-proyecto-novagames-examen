import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  alertButtons = ['Listo'];
  constructor(private router: Router) { }

  ngOnInit() {
  }
  irHome(){
    let navigationextras: NavigationExtras = {

    }    
    this.router.navigate(['/home'], navigationextras);

  }

}
