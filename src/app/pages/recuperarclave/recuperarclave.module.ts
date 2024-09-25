import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecuperarclavePageRoutingModule } from './recuperarclave-routing.module';

import { RecuperarclavePage } from './recuperarclave.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecuperarclavePageRoutingModule
  ],
  declarations: [RecuperarclavePage]
})
export class RecuperarclavePageModule {}
