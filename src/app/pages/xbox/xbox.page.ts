import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-xbox',
  templateUrl: './xbox.page.html',
  styleUrls: ['./xbox.page.scss'],
})
export class XboxPage implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }
  irCarrito(){
    let navigationextras: NavigationExtras = {

    }

    this.router.navigate(['/carrito'], navigationextras);
  }


}
