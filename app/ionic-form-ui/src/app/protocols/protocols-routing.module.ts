import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProtocolsPage } from './protocols.page';

const routes: Routes = [
  {
    path: '',
    component: ProtocolsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProtocolsPageRoutingModule {}
