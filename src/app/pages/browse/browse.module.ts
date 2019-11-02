import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { BrowsePage } from './browse';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BrowsePage
  }
];

@NgModule({
  imports: [
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BrowsePage
  ]
})
export class BrowsePageModule { }
