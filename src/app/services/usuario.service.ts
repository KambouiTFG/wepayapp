import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../interfaces/interfaces';
import { UiServiceService } from './ui-service.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  myUID = null;
  myInfo: User = {};
  hayUser = new EventEmitter();
  


  constructor(private db: AngularFirestore,
              private uiCtrl: UiServiceService) { }

  async grabarUser(uid: string, user) {
    const newUser: User = {
      nombre: user.nombre,
      email: user.email,
      avatar: user.avatar,
      salas: [],
      creado: new Date().getTime(),
      cambioNombre: new Date().getTime()
    };
    await this.db.collection('users').doc(uid).set(newUser).then( () => {
      console.log('Usuario grabado en la BD');
    });
  }

  async userUpdate(userUid: string, user: User) {
    if (!userUid) {
      userUid = this.myUID;
    }
    await this.db.collection('users').doc(userUid).update(user).then( () => {
      console.log('Usuario actualizado');
    });
  }

  setUsuario(uid: string) {
    // (uid) ? this.myUID = uid : this.myUID = null;
    if (uid) {
      this.myUID = uid;
      this.getMyInfo();
    } else {
      this.myUID = null;
    }
  }

  getMyInfo2() {
    return this.db.collection('users').doc(this.myUID).valueChanges();
  }

  async getMyInfo() {
    const loadingg = await this.uiCtrl.presentLoading('Cargando datos');

    this.db.collection('users').doc(this.myUID).valueChanges()
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
    const tempArr: string[] = this.myInfo.salas;
    tempArr.unshift(salaId);
    await this.db.collection('users').doc(this.myUID).update({
      salas: tempArr
    }).then(() => {
      console.log('Sala añadida al usuario');
    });
  }




  // Actualizar Usuario para añadir o quitar salas
}
