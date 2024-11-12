import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-gestionproductos',
  templateUrl: './gestionproductos.page.html',
  styleUrls: ['./gestionproductos.page.scss'],
})
export class GestionproductosPage implements OnInit {

  constructor(private menuCtrl: MenuController) {}

  ngOnInit() {}

  ionViewWillEnter() {
    // Habilita el menú de administrador al entrar en esta página
    this.menuCtrl.enable(true, 'menu-admin');
    this.menuCtrl.enable(false, 'menu-usuarios');
  }
}