import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistorialventasadminPageRoutingModule } from './historialventasadmin-routing.module';

import { HistorialventasadminPage } from './historialventasadmin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistorialventasadminPageRoutingModule
  ],
  declarations: [HistorialventasadminPage]
})
export class HistorialventasadminPageModule {}
