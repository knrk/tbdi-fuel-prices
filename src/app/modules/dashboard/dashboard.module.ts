import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'moment/locale/cs';
import { MomentModule } from 'ngx-moment';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { PipesModule } from '@core/pipes.module';
import { DialogsModule } from '@shared/dialogs/dialogs.module';

import { NbTabsetModule, NbIconModule, NbListModule, NbButtonModule, NbInputModule, NbDatepickerModule, NbWindowModule } from '@nebular/theme';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddPriceComponent } from '@shared/dialogs/add-price/add-price.component';

import { AuthGuard } from '@core/services/auth.guard';


// Routing
const routes: Routes = [
    {
      path: '',
      canActivateChild: [AuthGuard],
      component: DashboardComponent
    }
]

@NgModule({
  declarations: [
    DashboardComponent,
    AddPriceComponent
  ],
  imports: [
    CommonModule,
    MomentModule, 
    NbWindowModule.forRoot(),
    NbInputModule,
    NbButtonModule,
    NbDatepickerModule,
    NbListModule,
    NbTabsetModule,
    NbIconModule,
    NgxChartsModule,
    PipesModule,
    DialogsModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [
    AddPriceComponent
  ],
  exports: [
    
  ]
})
export class DashboardModule { }
