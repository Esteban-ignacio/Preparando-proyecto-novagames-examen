import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionproductosPage } from './gestionproductos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionproductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionproductosPageRoutingModule {}
