import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  templateUrl: './notfound.page.html',
  styleUrls: ['./notfound.page.scss'],
})
export class NotfoundPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  irTienda(){
    let navigationextras: NavigationExtras = {

    }
   
    this.router.navigate(['/home'], navigationextras);
  }
}