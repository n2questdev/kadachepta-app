import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginPage } from './login.page';
import { RouterModule } from '@angular/router';

const routes: Array<any> = [
  {
    path: '',
    component: LoginPage,
    outlet: 'login'
  }
];

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [IonicModule, RouterModule.forChild(routes)]
  ,
})
export class LoginPageModule {}
