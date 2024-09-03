import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-playstation',
  templateUrl: './playstation.page.html',
  styleUrls: ['./playstation.page.scss'],
})
export class PlaystationPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }
  irCarrito(){
    let navigationextras: NavigationExtras = {

    }

    this.router.navigate(['/carrito'], navigationextras);
  }


}