import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'chart', pathMatch: 'full' },
    { path: 'chart', loadChildren: () => import('./chart/chart.module').then( (m) => m.ChartComponentModule)},
];

// const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
