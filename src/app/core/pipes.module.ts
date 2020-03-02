import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CallbackPipe } from '@core/pipes/callback.pipe';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CallbackPipe
    ],
    exports: [
        CallbackPipe
    ]
})
export class PipesModule {}
