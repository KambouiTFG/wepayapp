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
              private uiCtrl: UiServiceService) {
                
                /* this.users.subscribe( r => {
                  this.usuarios = r;
                  console.log('q carayo', this.usuarios);
                }); */
              }

  private get users(): Observable<any> {
    return this.db.collection('users').valueChanges({ idField: 'propertyId' });
  }

  getNombre(uid: string) {
    // console.log('getnombre');
    const uuser: User = this.usuarios.find(user => user.propertyId === uid);
    const infoUser = {
      nombre : uuser.nombre,
      avatar : uuser.avatar
    };
    return infoUser;
  }

  

  async grabarUser(uid: string, user) {
    // console.log('grabarnombre');

    const newUser: User = {
      nombre: user.nombre,
      email: user.email,
      avatar: user.avatar,
      salas: [],
      creado: new Date().getTime(),
      cambioNombre: new Date().getTime()
    };
    await this.db.collection('users').doc(uid).set(newUser).then( () => {
      // console.log('Usuario grabado en la BD');
    });
  }

  async userUpdate(userUid: string, user: User) {
    // console.log('userUpdate');

    if (!userUid) {
      userUid = this.myUID;
    }
    await this.db.collection('users').doc(userUid).update(user).then( () => {
      // console.log('Usuario actualizado');
    });
  }

  setUsuario(uid: string) {
    // console.log('setUsuario');

    if (uid) {
      this.subSupremo = this.users.subscribe( r => {
        this.usuarios = r;
        this.hayCambio.emit(true);
        // console.log('q carayo', this.usuarios);
      });
    } else {
      if (this.subSupremo) {
        this.subSupremo.unsubscribe();
      }

      if (this.subMyInfo) {
        this.subMyInfo.unsubscribe();
      }
    }
    
    // (uid) ? this.myUID = uid : this.myUID = null;
    if (uid) {
      this.myUID = uid;
      this.getMyInfo();
    } else {
      this.myUID = null;
    }
  }

  getMyInfo2() {
    // console.log('getMyInfo2');

    return this.db.collection('users').doc(this.myUID).valueChanges();
  }

  async getMyInfo() {
    // console.log('getMyInfo');

    const loadingg = await this.uiCtrl.presentLoading('Cargando datos');

    this.subMyInfo = this.db.collection('users').doc(this.myUID).valueChanges()
    .subscribe( (r: User) => {
      // console.log('PERRA', r);
      if (r) {
        this.myInfo = r;
        this.hayUser.emit(r);
      } else {
        this.myInfo = null;
        // this.hayUser.emit('null');
      }
      this.uiCtrl.dismisLoading(loadingg);
    });
  }

  async addSalaMyUser(salaId: string) {
    // console.log('addSalaMyUser');
    const tempArr: string[] = this.myInfo.salas;
    if (!tempArr.includes(salaId)) {
      tempArr.unshift(salaId);
    }
    await this.db.collection('users').doc(this.myUID).update({
      salas: tempArr
    }).then(() => {
      // console.log('Sala añadida al usuario');
    });
  }

  async getInfoUser(idUser: string) {
    // console.log('getInfoUser');

    return await this.db.collection('users').doc(idUser).get().toPromise()
    .then(r => {
      return {
        nombre: r.data().nombre,
        avatar: r.data().avatar,
      };
    });
  }

  async getInfoSalasUser(idUser: string) {
    // console.log('getInfoSalasUser');
    return await this.db.collection('users').doc(idUser).get().toPromise()
    .then(r => {
      return r.data().salas;
    });
  }

      // this._user.deleteUserSala(this.idSala, idUser);

  async deleteUserSala(idSala: string, idUser: string) {
    // console.log('deleteUserSala');

    const salas: string[] = await this.getInfoSalasUser(idUser);
    salas.splice(salas.indexOf(idSala), 1);

    await this.db.collection('users').doc(idUser).update({
      salas
    }).then(() => {
      // console.log('Sala borrada del usuario');
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





  // Actualizar Usuario para añadir o quitar salas
}
