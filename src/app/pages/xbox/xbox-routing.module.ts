import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { XboxPage } from './xbox.page';

const routes: Routes = [
  {
    path: '',
    component: XboxPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class XboxPageRoutingModule {}
