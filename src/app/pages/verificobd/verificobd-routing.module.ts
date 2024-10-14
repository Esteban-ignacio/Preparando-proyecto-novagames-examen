import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificobdPage } from './verificobd.page';

const routes: Routes = [
  {
    path: '',
    component: VerificobdPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificobdPageRoutingModule {}
