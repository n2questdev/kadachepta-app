import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';

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


