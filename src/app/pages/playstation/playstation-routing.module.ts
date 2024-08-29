import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaystationPage } from './playstation.page';

const routes: Routes = [
  {
    path: '',
    component: PlaystationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaystationPageRoutingModule {}
