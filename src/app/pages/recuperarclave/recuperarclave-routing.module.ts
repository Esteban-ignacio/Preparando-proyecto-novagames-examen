import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecuperarclavePage } from './recuperarclave.page';

const routes: Routes = [
  {
    path: '',
    component: RecuperarclavePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecuperarclavePageRoutingModule {}
