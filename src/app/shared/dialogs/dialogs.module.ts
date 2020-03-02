import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { NbInputModule, NbDatepickerModule, NbButtonModule } from '@nebular/theme';

@NgModule({
  declarations: [
    
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbDatepickerModule,
  ],
  entryComponents: [
    
  ],
  exports: [
    ReactiveFormsModule,
    NbInputModule,
    NbButtonModule,
    NbDatepickerModule,
  ]
})
export class DialogsModule { }
