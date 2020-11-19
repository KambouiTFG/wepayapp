import { EventEmitter, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Sala } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { UiServiceService } from './ui-service.service';
import { Observable, Subscription } from 'rxjs';
import { ProductoService } from './producto.service';


@Injectable({
  providedIn: 'root'
})
export class SalaService {
  haySala = new EventEmitter();
  cambio = new EventEmitter();
  idSala = '';
  infoSala: Sala = {};
  myUID = null;
  salaSub: Subscription;

  subSupremo: Subscription;

  todasSalas: Sala[] = [];

  
  constructor(private navCtrl: NavController,
              private db: AngularFirestore,
              private _user: UsuarioService,
              private uiCtrl: UiServiceService,
              private _producto: ProductoService) {

              }

  private get salas(): Observable<any> {
    return this.db.collection('salas').valueChanges({ idField: 'propertyId' });
  }

  getInfoSala(idSala: string) {
    const salaDB: Sala = this.todasSalas.find(sala => sala.propertyId === idSala);
    return salaDB;
  }

  

  salirSala() {
    this.haySala.emit(null);
    this.idSala = '';
    if (this.salaSub) {
      this.salaSub.unsubscribe();
    }
    this.navCtrl.navigateRoot('/main/home');
  }

  setUsuario(uid: string) {
    if (uid) {
      this.subSupremo = this.salas.subscribe( ( r: any) => {
        this.todasSalas = r;
        this.cambio.emit(true);
      });
    } else {
      this.pararSubs();
      this._producto.pararSub();
    }
    (uid) ? this.myUID = uid : this.myUID = null;
  }


  async grabarSala(nombre: string) {
    const newSala: Sala = {
      nombre,
      owner : this.myUID,
      admins : [],
      participantes: [this.myUID],
      desc: '',
      img : '',
      code: Math.random().toString(36).substr(6, 9),
      open: true,
      creado : new Date().getTime()
    };
    await this.db.collection('salas').add(newSala).then( async ( r ) => {
      await this._user.addSalaMyUser(r.id);
      await this.seleccionarSala(r.id);
    });
  }

  async seleccionarSala(idSala: string) {
    this.idSala = idSala;
    await this.getActualInfoSala();
  }

  async getActualInfoSala() {
    const loadingg = await this.uiCtrl.presentLoading('Entrando en sala');
    this._producto.getProducoInfo(this.idSala);
    this.salaSub = this.db.collection('salas').doc(this.idSala).valueChanges()
    .subscribe( (r: Sala) => {
      if (r) {
        this.infoSala = r;
        this.haySala.emit(this.infoSala);
        if (this.infoSala.participantes.includes(this.myUID)) {
          this.navCtrl.navigateRoot('/main/room');
        } else {
          this.navCtrl.navigateRoot('/main/home');
        }
      } else {
        this.infoSala = null;
      }
      this.uiCtrl.dismisLoading(loadingg);
    });
  }

  async buscarSala2(code: string) {
    const loadingg = await this.uiCtrl.presentLoading('Buscando sala');
    const busqueda: any = await new Promise( async (resolve) => {
      await this.db.collection('salas').ref.where('code', '==', code).where('open', '==', true)
      .get().then( r => {
        r.forEach( async rr => {
          resolve({datos: rr.data(), idSala: rr.id});
        });
      });
      resolve(null);
      this.uiCtrl.dismisLoading(loadingg);
    });

    if (busqueda && !busqueda.datos.participantes.includes(this.myUID)) {
      await this.uiCtrl.presentAlertConfirm(busqueda.datos, busqueda.idSala);
      this.uiCtrl.Confirm.subscribe( async r => {
        await this._user.addSalaMyUser(r);
        await this.addSalaUser(r, this.myUID);
        await this.seleccionarSala(busqueda.idSala);
        this._producto.newUser = this.myUID;
      });
    } else {
      await this.uiCtrl.presentAlert('Sin resultados');
    }
  }

  async buscarSala(code: string) {
    const loadingg = await this.uiCtrl.presentLoading('Buscando sala');
    const busqueda = this.todasSalas.find(sala => sala.code === code);
    this.uiCtrl.dismisLoading(loadingg);

    if (busqueda && busqueda.code && !busqueda.participantes.includes(this.myUID)) {
      await this.uiCtrl.presentAlertConfirm(busqueda, busqueda.propertyId);
      this.uiCtrl.Confirm.subscribe( async (r: string) => {
        await this._user.addSalaMyUser(r);
        await this.addSalaUser(r, this.myUID);
        await this.seleccionarSala(busqueda.propertyId);
        this._producto.newUser = this.myUID;
      });
    } else {
      await this.uiCtrl.presentAlert('Sin resultados');
    }
  }

  // Añadir usuario a una sala
  async addSalaUser(idSala: string, idUser: string) {
    const infoSala = this.getInfoSala(idSala);
    const arrTemp: string[] = infoSala.participantes;
    if (!arrTemp.includes(idUser)) {
      arrTemp.push(idUser);
    }
    await this.db.collection('salas').doc(idSala).update({
      participantes: arrTemp
    }).then( async () => {
      if (idUser.includes('-')) {
        this._producto.addUserTodosProductos(idSala, idUser);
      }
    });
  }

  // Borrar usuario de una sala
  async deleteSalaUser(idUser: string) {
    this.infoSala.participantes.splice(this.infoSala.participantes.indexOf(idUser), 1);
    if (this.infoSala.admins.includes(idUser)) {
      this.infoSala.admins.splice(this.infoSala.admins.indexOf(idUser), 1);
    }
    const isala = this.idSala;
    await this.db.collection('salas').doc(this.idSala).update(this.infoSala)
    .catch( e => {
      console.error('falló la operación (deleteSalaUser)', e);
    });
    if (!idUser.includes('-')) {
      await this._user.deleteUserSala(this.idSala, idUser);
    }
    this._producto.deleteUserTodosProductos(isala, idUser);
    if (this.myUID === idUser) {
      this.salirSala();
    }
  }

  async cambioNombreSala(nombre: string) {
    const loadingg = await this.uiCtrl.presentLoading('Cambiando nombre');
    await this.db.collection('salas').doc(this.idSala).update({
      nombre
    }).catch( e => {
      console.error('falló la operación (cambioNombreSala)', e);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }

  async cambioDescSala(desc: string) {
    const loadingg = await this.uiCtrl.presentLoading('Cambiando descripción');
    await this.db.collection('salas').doc(this.idSala).update({
      desc
    }).catch( e => {
      console.error('falló la operación (cambioDescSala)', e);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }

  async cambiarEstado(open: boolean) {
    let msg;
    (open) ? msg = 'Abriendo sala' : msg = 'Cerrando sala';
    const loadingg = await this.uiCtrl.presentLoading(msg);
    await this.db.collection('salas').doc(this.idSala).update({
      open
    }).catch( e => {
      console.error('falló la operación (cambiarEstado)', e);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }

  async cambioImgSala(img: string) {
    const loadingg = await this.uiCtrl.presentLoading('Cambiando Imagen');
    await this.db.collection('salas').doc(this.idSala).update({
      img
    }).catch( e => {
      console.error('falló la operación (cambioImgSala)', e);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }

  async addAdmin(idUser: string) {
    if (this.infoSala.admins.includes(idUser)) {
      return;
    }

    this.infoSala.admins.unshift(idUser);
    const loadingg = await this.uiCtrl.presentLoading('Añadiendo administrador');
    await this.db.collection('salas').doc(this.idSala).update({
      admins: this.infoSala.admins
    }).catch( e => {
      console.error('falló la operación (addAdmin)', e);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }


  async deleteAdmin(idUser: string) {
    if (!this.infoSala.admins.includes(idUser)) {
      return;
    }

    this.infoSala.admins.splice(this.infoSala.admins.indexOf(idUser), 1);
    const loadingg = await this.uiCtrl.presentLoading('Borrando administrador');
    await this.db.collection('salas').doc(this.idSala).update({
      admins: this.infoSala.admins
    }).catch( e => {
      console.error('falló la operación (deleteAdmin)', e);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }


  async borrarSala() {
    const loadingg = await this.uiCtrl.presentLoading('Borrando sala');
    const isala = this.idSala;
    this.infoSala.participantes.forEach(async user => {
      await this._user.deleteUserSala(this.idSala, user);
      if (this.myUID === user) {
        this.salirSala();
      }
    });
    await this.db.collection('salas').doc(isala).delete()
    .catch( e => {
      console.error('falló la operación (borrarSala)', e);
    });
    this.salirSala();
    this.uiCtrl.dismisLoading(loadingg);
    // await this._user.deleteUserSala(this.idSala, this.infoSala.owner);
  }


  pararSubs() {
    if (this.subSupremo) {
      this.subSupremo.unsubscribe();
    }
    if (this.salaSub) {
      this.salaSub.unsubscribe();
    }
  }


  async addBotSala(nombre: string) {
    let id = Math.random().toString(35).substr(2, 8).toLocaleUpperCase();
    id = `bot-${nombre}-${id}`;
    await this.addSalaUser(this.idSala, id);
  }
}
