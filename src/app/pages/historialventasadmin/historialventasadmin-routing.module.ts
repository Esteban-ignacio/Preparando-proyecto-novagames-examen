import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistorialventasadminPage } from './historialventasadmin.page';

const routes: Routes = [
  {
    path: '',
    component: HistorialventasadminPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistorialventasadminPageRoutingModule {}
