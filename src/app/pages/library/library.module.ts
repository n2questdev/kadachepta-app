import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LibraryPage } from './library.page';
import { RouterModule } from '@angular/router';

const routes: Array<any> = [
  {
    path: '',
    component: LibraryPage,
    outlet: 'library'
  }
];

@NgModule({
  declarations: [
    LibraryPage,
  ],
  imports: [
    IonicModule, RouterModule.forChild(routes),
  ]
})
export class LibraryPageModule {}
