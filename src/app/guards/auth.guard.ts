import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  
  constructor(private _auth: AuthService,
              private navCtrl: NavController) { }


  canActivate(): boolean  {
    // console.log('en el guard');
    if (this._auth.userOn) {
      // console.log('Puedes entrar', this._auth.userOn);
      return true;
    } else {
      // console.log('NO PASARAS', this._auth.userOn);
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }
  
  canLoad(): boolean {
    // console.log('en el guard');
    if (this._auth.userOn) {
      // console.log('Puedes entrar', this._auth.userOn);
      return true;
    } else {
      // console.log('NO PASARAS', this._auth.userOn);
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }
}
