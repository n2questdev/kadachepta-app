import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from '../home/home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage // TODO: need to fix this route. Suppose to be SearchPage
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


