import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  Nombre: string = "";
  Apellido: string = "";
  Correo: string = "";
  Telefono: string = "";
  Contrasena: string = "";

  constructor(private router: Router, private alertController: AlertController) { }
  
  ngOnInit() {
  }

  async presentAlert(titulo:string, msj:string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: msj,
      buttons: ['Listo'],
    });

    await alert.present();
  }

  irHome(){
    let navigationextras: NavigationExtras = {

      }   
    this.router.navigate(['/home'], navigationextras);
    }

  irPerfil(){
    let navigationextras: NavigationExtras = {
      
    }
    this.router.navigate(['/perfil'], navigationextras);
  
    }

    registrar(){
      //aqui hacemos las validaciones del formulario
      this.presentAlert('Registro','Usuario Registrado');
    }
}
