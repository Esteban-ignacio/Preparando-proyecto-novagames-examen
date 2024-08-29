import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaystationPageRoutingModule } from './playstation-routing.module';

import { PlaystationPage } from './playstation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaystationPageRoutingModule
  ],
  declarations: [PlaystationPage]
})
export class PlaystationPageModule {}
