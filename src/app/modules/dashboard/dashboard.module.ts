import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import 'moment/locale/cs';
import { MomentModule } from 'ngx-moment';
import { NbTabsetModule } from '@nebular/theme';

import { DashboardComponent } from './dashboard/dashboard.component';
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
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    MomentModule,
    NbTabsetModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    MomentModule
  ]
})
export class DashboardModule { }
