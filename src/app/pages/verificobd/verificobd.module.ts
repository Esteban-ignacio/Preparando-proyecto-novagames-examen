import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificobdPageRoutingModule } from './verificobd-routing.module';

import { VerificobdPage } from './verificobd.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificobdPageRoutingModule
  ],
  declarations: [VerificobdPage]
})
export class VerificobdPageModule {}
