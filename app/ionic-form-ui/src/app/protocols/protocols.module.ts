import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProtocolsPageRoutingModule } from './protocols-routing.module';

import { ProtocolsPage } from './protocols.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProtocolsPageRoutingModule
  ],
  declarations: [ProtocolsPage]
})
export class ProtocolsPageModule {}
