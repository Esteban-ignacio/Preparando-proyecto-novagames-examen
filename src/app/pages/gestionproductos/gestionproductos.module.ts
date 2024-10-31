import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionproductosPageRoutingModule } from './gestionproductos-routing.module';

import { GestionproductosPage } from './gestionproductos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionproductosPageRoutingModule
  ],
  declarations: [GestionproductosPage]
})
export class GestionproductosPageModule {}
