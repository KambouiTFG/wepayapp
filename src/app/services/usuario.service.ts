import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, pipe, Subscription } from 'rxjs';
import { User } from '../interfaces/interfaces';
import { UiServiceService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  myUID = null;
  myInfo: User = {};
  hayUser = new EventEmitter();
  subMyInfo: Subscription;
  hayCambio = new EventEmitter();

  subSupremo: Subscription;
  usuarios: User[];
  

  constructor(private db: AngularFirestore,
              private uiCtrl: UiServiceService) { }

  private get users(): Observable<any> {
    return this.db.collection('users').valueChanges({ idField: 'propertyId' });
  }

  getNombre(uid: string) {
    const uuser: User = this.usuarios.find(user => user.propertyId === uid);
    const infoUser = {
      nombre : uuser.nombre,
      avatar : uuser.avatar
    };
    return infoUser;
  }

  getMisSalas() {
    if (this.usuarios) {
      const uuser: User = this.usuarios.find(user => user.propertyId === this.myUID);
      return uuser.salas;
    }
    return [];
  }



  async grabarUser(uid: string, user: User) {
    const newUser: User = {
      nombre: user.nombre,
      email: user.email,
      avatar: user.avatar,
      salas: [],
      creado: new Date().getTime(),
    };
    await this.db.collection('users').doc(uid).set(newUser);
  }

  async userUpdate(user: User) {
    await this.db.collection('users').doc(this.myUID).update(user).then( () => {
      this.uiCtrl.alertaInformativa('Cambios actualizados', 0.5);
    });
  }

  setUsuario(uid: string) {
    if (uid) {
      this.myUID = uid;
      this.getMyInfo();

      this.subSupremo = this.users.subscribe( r => {
        this.usuarios = r;
        this.hayCambio.emit(true);
      });
    } else {
      this.myUID = null;
      this.pararSubs();
    }

    /* if (uid) {
      this.myUID = uid;
      this.getMyInfo();
    } else {
      this.myUID = null;
    } */
  }

  getMyInfo2() {
    return this.db.collection('users').doc(this.myUID).valueChanges();
  }

  async getMyInfo() {
    const loadingg = await this.uiCtrl.presentLoading('Cargando datos');
    this.subMyInfo = this.db.collection('users').doc(this.myUID).valueChanges()
    .subscribe( (user: User) => {
      if (user) {
        this.myInfo = user;
        this.hayUser.emit(user);
      } else {
        this.myInfo = null;
      }
      this.uiCtrl.dismisLoading(loadingg);
    });
  }

  async addSalaMyUser(salaId: string) {
    const tempArr: string[] = this.myInfo.salas;
    if (!tempArr.includes(salaId)) {
      tempArr.unshift(salaId);
    }
    await this.db.collection('users').doc(this.myUID).update({
      salas: tempArr
    }).catch( e => {
      console.error('falló la operacion (addSalaMyUser)', e);
    });
  }

  async getInfoUser(idUser: string) {
    return await this.db.collection('users').doc(idUser).get().toPromise()
    .then(r => {
      return {
        nombre: r.data().nombre,
        avatar: r.data().avatar,
      };
    });
  }

  async getInfoSalasUser(idUser: string) {
    return await this.db.collection('users').doc(idUser).get().toPromise()
    .then(r => {
      return r.data().salas;
    });
  }

  async deleteUserSala(idSala: string, idUser: string) {
    const salas: string[] = await this.getInfoSalasUser(idUser);
    salas.splice(salas.indexOf(idSala), 1);

    await this.db.collection('users').doc(idUser).update({
      salas
    }).catch( e => {
      console.error('falló la operación (deleteUserSala)', e);
    });
  }

  pararSubs() {
    if (this.subSupremo) {
      this.subSupremo.unsubscribe();
    }
    if (this.subMyInfo) {
      this.subMyInfo.unsubscribe();
    }
  }
}
