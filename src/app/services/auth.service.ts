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
  userOn: string;

  constructor(private fAuth: AngularFireAuth,
              private _user: UsuarioService,
              private navCtrl: NavController,
              private uiCtrl: UiServiceService,
              private _sala: SalaService,
              private _producto: ProductoService) {

    this.fAuth.authState.subscribe( user => {
      if (user) {
        this.userOn = user.uid;
        this._user.setUsuario(user.uid);
        this._sala.setUsuario(user.uid);
        this.navCtrl.navigateRoot('/main/home');
      } else {
        this.userOn = null;
        /* this.pararSubs();
        this._user.setUsuario(null);
        this._sala.setUsuario(null); */
        this.navCtrl.navigateRoot('/login');
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

  async register(user: any) {
    await this.fAuth.createUserWithEmailAndPassword(user.email, user.password)
    .then(async (resp) => {
      await this._user.grabarUser(resp.user.uid, user);
    }).catch(() => {
      this.uiCtrl.alertaInformativa('Email ya registrado');
    });
  }

  async logout() {
    const loading = await this.uiCtrl.presentLoading('Hasta luego');
    this._user.setUsuario(null);
    this._sala.setUsuario(null);
    this._producto.pararSub();
    await this.fAuth.signOut();
    await this.uiCtrl.dismisLoading(loading);
  }

  

  async resetPass(email: string) {
      const resetEmail = await this.uiCtrl.presentModalResetPassword(email);
      if (resetEmail) {
        await this.fAuth.sendPasswordResetEmail(resetEmail).then( () => {
          this.uiCtrl.alertaInformativa('Se ha enviado con correo al email introducido' +
                                          'revise la bandeja de entrada o en spam', 3.5);
        }).catch( () => {
          this.uiCtrl.alertaInformativa('Email inexistente', 3.5);
        });
      }
  }

  
  /* pararSubs() {
    this._sala.pararSubs();
    this._user.pararSubs();
    this._producto.pararSub();
  } */
}
