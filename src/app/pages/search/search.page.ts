import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];
@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild(routes),
  ],
})
export class SearchPage {}
