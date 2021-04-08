import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExperimentsPageRoutingModule } from './experiments-routing.module';

import { ExperimentsPage } from './experiments.page';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExperimentsPageRoutingModule
  ],
  declarations: [ExperimentsPage],
  providers: [
    InAppBrowser
  ]
})
export class ExperimentsPageModule {}
