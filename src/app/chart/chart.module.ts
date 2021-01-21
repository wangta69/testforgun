import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChartComponent } from './chart.component';

@NgModule({
    imports: [
        CommonModule,

        RouterModule.forChild([
            {
        path: '',
        component: ChartComponent
        }
        ]),
    ],
    providers: [
    ],
    declarations: [
        ChartComponent,
    ],
    exports: [
    //    LineTransitonComponent,
    ]
})
export class ChartComponentModule { }
