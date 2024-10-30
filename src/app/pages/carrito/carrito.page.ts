import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Productos } from 'src/app/service/productos';
import { ServiceBDService } from 'src/app/service/service-bd.service';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
})
export class CarritoPage implements OnInit {

  productos: Productos[] = [];

  constructor(private alertController: AlertController,  private bdService: ServiceBDService) { }

  ngOnInit() {
    
  }
 

  async presentAlert(titulo: string, msj: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Realizado'],
    });
  
    await alert.present();
  }
  
  

  Comprar(){
    this.presentAlert('Comprado', 'Compra Realizada')
  }
}


