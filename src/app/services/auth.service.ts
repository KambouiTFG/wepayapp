import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsuarioService } from './usuario.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from './ui-service.service';
import { SalaService } from './sala.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userOn;

  constructor(private fAuth: AngularFireAuth,
              private _user: UsuarioService,
              private navCtrl: NavController,
              private uiCtrl: UiServiceService,
              private _sala: SalaService) {

    this.fAuth.authState.subscribe( r => {
      if (r) {
        this.userOn = r.uid;
        this.navCtrl.navigateRoot('/main/tabs/home');
        this._user.setUsuario(r.uid);
        this._sala.setUsuario(r.uid);
      } else {
        this.userOn = null;
        this.navCtrl.navigateRoot('/login');
        this._user.setUsuario(null);
        this._sala.setUsuario(null);

      }
      console.log('HAY USUARIO?', this.userOn);
    });
  }

  async login(email: string, pass: string) {
    const loading = await this.uiCtrl.presentLoading('Entrando')
    await this.fAuth.signInWithEmailAndPassword(email, pass)
    .then( r => {
      console.log('Iniciando sesion correctamente');
      // console.log(r);
    }).catch( e => {
      console.log(e);
      this.uiCtrl.alertaInformativa('Email y/o contraseña incorrectos');
    });
    await this.uiCtrl.dismisLoading(loading);
  }

  async register(user) {
    await this.fAuth.createUserWithEmailAndPassword(user.email, user.password).then(async (resp) => {
      await this._user.grabarUser(resp.user.uid, user);
      console.log(('Usuario creado correctamente'));
      this.navCtrl.navigateRoot('/main/tabs/home');
    }).catch(err => {
      console.log(err);
      this.uiCtrl.alertaInformativa('Email ya registrado');
    });
  }

  async logout() {
    const loading = await this.uiCtrl.presentLoading('Hasta luego');
    await this.fAuth.signOut();
    await this.uiCtrl.dismisLoading(loading);
    // this.navCtrl.navigateRoot('/login');
  }
}
