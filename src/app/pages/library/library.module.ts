import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LibraryPage } from './library.page';

@NgModule({
  declarations: [
    LibraryPage,
  ],
  imports: [
    IonicModule.forChild(LibraryPage),
  ],
})
export class LibraryPageModule {}
