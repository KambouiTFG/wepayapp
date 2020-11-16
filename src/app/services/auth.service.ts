import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { UsuarioService } from './usuario.service';
import { NavController } from '@ionic/angular';
import { UiServiceService } from './ui-service.service';
import { SalaService } from './sala.service';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userOn;

  constructor(private fAuth: AngularFireAuth,
              private _user: UsuarioService,
              private navCtrl: NavController,
              private uiCtrl: UiServiceService,
              private _sala: SalaService,
              private _producto: ProductoService) {

    this.fAuth.authState.subscribe( user => {
      if (user) {
        this.userOn = user.uid;
        this.navCtrl.navigateRoot('/main/home');
        this._user.setUsuario(user.uid);
        this._sala.setUsuario(user.uid);
      } else {
        this.userOn = null;
        this.pararSubs();
        this.navCtrl.navigateRoot('/login');
        this._user.setUsuario(null);
        this._sala.setUsuario(null);
      }
    });
  }

  async login(email: string, pass: string) {
    const loading = await this.uiCtrl.presentLoading('Entrando');
    await this.fAuth.signInWithEmailAndPassword(email, pass)
    .catch( () => {
      this.uiCtrl.alertaInformativa('Email y/o contraseña incorrectos');
    });
    await this.uiCtrl.dismisLoading(loading);
  }

  async register(user) {
    await this.fAuth.createUserWithEmailAndPassword(user.email, user.password).then(async (resp) => {
      await this._user.grabarUser(resp.user.uid, user);
      this.navCtrl.navigateRoot('/main/home');
    }).catch(() => {
      this.uiCtrl.alertaInformativa('Email ya registrado');
    });
  }

  async logout() {
    this._user.setUsuario(null);
    this._sala.setUsuario(null);
    this.pararSubs();
    const loading = await this.uiCtrl.presentLoading('Hasta luego');
    await this.fAuth.signOut();
    await this.uiCtrl.dismisLoading(loading);
  }


  async resetPass(email: string) {
      const resetEmail = await this.uiCtrl.presentModalResetPassword(email);
      if (resetEmail) {
        await this.fAuth.sendPasswordResetEmail(resetEmail).then( () => {
          this.uiCtrl.alertaInformativa('Se ha enviado con correo al email introducido, revise la bandeja de entrada o en spam', 3.5);
        }).catch( () => {
          this.uiCtrl.alertaInformativa('Email inexistente', 3.5);
        });
      }
  }
  pararSubs() {
    this._sala.pararSubs();
    this._user.pararSubs();
    this._producto.pararSub();
  }
}
