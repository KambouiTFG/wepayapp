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
/* 
                this._user.hayUser.subscribe( user => {
                  if (user) {
                    console.log('Hay user');
                    this.salas.subscribe( ( r: any) => {
                      console.log('q viene aka?', r);
                      this.todasSalas = r;
                      console.log('q carayo', this.todasSalas);
                    });
                  }
                });
                console.log('que pasa gwente');
                
                console.log('QUE PASA x2'); */
              }

  private get salas(): Observable<any> {
    // console.log('get Salas');
    // console.log('hay problemas?');
    return this.db.collection('salas').valueChanges({ idField: 'propertyId' });
  }

  getInfoSala(idSala: string) {
    // console.log('get info sala');
    // console.log(idSala, 'IDSALA');

    /* this.salas.subscribe( ( r: any) => {
      console.log('q viene aka?', r);
      this.todasSalas = r;
      console.log('q carayo', this.todasSalas);
    }); */

    const salaDB: Sala = this.todasSalas.find(sala => sala.propertyId === idSala);
    /* let infoSala;
    if (salaDB) {
      infoSala = {
        nombre : salaDB.nombre,
        img : salaDB.img,
        participantes: salaDB.participantes,
        owner: salaDB.owner,
        admins: salaDB.admins
      };
    } */
    return salaDB;
  }

  async seleccionarSala(idSala: string) {
    // console.log('seleccionar sala');
    // this.haySala.emit(idSala);
    this.idSala = idSala;
    await this.getActualInfoSala();
  }

  salirSala() {
    // console.log('salir sala');
    this.haySala.emit(null);
    if (this.salaSub) {
      // console.log('CANCELAMOS SUBSCRIPTION');
      // console.log('AKA MATAMOOO');
      this.salaSub.unsubscribe();
    }
    this.navCtrl.navigateRoot('/main/tabs/home');
  }

  setUsuario(uid: string) {
    // console.log('set usuario');
    if (uid) {
      // console.log('no debe ser null', uid);
      this.subSupremo = this.salas.subscribe( ( r: any) => {
        // console.log('q viene aka?', r);
        // console.log('HAY UN CAMBIO EN ALGUNA SALA');
        this.todasSalas = r;
        // console.log('q carayo', this.todasSalas);
        // console.log('EMITIENDO CAMBIOS');
        this.cambio.emit(true);

      });
    } else {
      /* if (this.subSupremo) {
        console.log('aka matamo');
        this.subSupremo.unsubscribe();
      } */
      this.pararSubs();
      this._producto.pararSub();
    }
    
    (uid) ? this.myUID = uid : this.myUID = null;
  }


  async grabarSala(nombre: string) {
    // console.log('grabar Salas');
    const newSala: Sala = {
      nombre,
      owner : this.myUID,
      admins : [],
      participantes: [this.myUID],
      img : '',
      code: Math.random().toString(36).substr(6, 9),
      open: true,
      creado : new Date().getTime()
    };
    await this.db.collection('salas').add(newSala).then( async ( r ) => {
      // Actualizar usuario, añadir uid sala en arreglo Salas del usuario
      // console.log('Sala añadida la BD');
      await this._user.addSalaMyUser(r.id);
      await this.seleccionarSala(r.id);
    });
  }

  /* async getInfoSala(salaId: string) {
    return await this.db.collection('salas').doc(salaId).get().toPromise()
    .then(r => {
      return {
        nombre: r.data().nombre,
        img: r.data().img,
        participantes: r.data().participantes,
        owner: r.data().owner,
        admins: r.data().admins
      };
    });
  } */
  async getActualInfoSala() {
    // console.log('get actual info sala');
    const loadingg = await this.uiCtrl.presentLoading('Entrando en sala');
    this._producto.getProducoInfo(this.idSala);
    this.salaSub = this.db.collection('salas').doc(this.idSala).valueChanges()
    .subscribe( (r: Sala) => {
      // console.log('AKA ENTRAMO');
      if (r) {
        this.infoSala = r;
        this.haySala.emit(this.infoSala);
        if (this.infoSala.participantes.includes(this.myUID)) {
          this.navCtrl.navigateRoot('/main/tabs/room');
        } else {
          this.navCtrl.navigateRoot('/main/tabs/home');
        }
      } else {
        this.infoSala = null;
        // console.log('No hay sala', r);
        // this.haySala.emit('');
      }
      this.uiCtrl.dismisLoading(loadingg);
    });
  }

  async buscarSala(code: string) {
    // console.log('buscar sala');
    const loadingg = await this.uiCtrl.presentLoading('Buscando sala');
    const busqueda: any = await new Promise( async (resolve) => {
      await this.db.collection('salas').ref.where('code', '==', code).where('open', '==', true)
      .get().then( r => {
        r.forEach( async rr => {
          resolve({datos: rr.data(), idSala: rr.id});
          // console.log('AQUI LLEGA?');
        });
      });
      resolve(null);
      this.uiCtrl.dismisLoading(loadingg);
    });

    // console.log('Resultado: ', busqueda);
    // console.log('MyID: ', this.myUID);
    // console.log('Estoy en la sala?', busqueda.datos.participantes.indexOf(this.myUID));
    // (busqueda) ? await this.uiCtrl.presentAlertConfirm(busqueda.datos) : await this.uiCtrl.presentAlert('Sin resultados');
    if (busqueda && !busqueda.datos.participantes.includes(this.myUID)) {
      await this.uiCtrl.presentAlertConfirm(busqueda.datos, busqueda.idSala);
      this.uiCtrl.Confirm.subscribe( async r => {
        await this._user.addSalaMyUser(r);
        await this.addSalaUser(r, this.myUID);
        await this.seleccionarSala(busqueda.idSala);
        this._producto.newUser = this.myUID;
        // console.log('qué sale antes?');
      });

    } else {
      await this.uiCtrl.presentAlert('Sin resultados');
    }
  }

  // Añadir usuario a una sala
  async addSalaUser(idSala: string, idUser: string) {
    // console.log('add user sala');
    let infoSala = await this.getInfoSala(idSala);
    const arrTemp: string[] = infoSala.participantes;
    if (!arrTemp.includes(idUser)) {
      arrTemp.push(idUser);
    }
    await this.db.collection('salas').doc(idSala).update({
      participantes: arrTemp
    }).then( () => {
      // console.log('Sala actualizada');
    });
  }
  // Borrar usuario de una sala
  async deleteSalaUser(idUser: string) {
    // console.log('delete user sala');
    // const arrTemp: string[] = this.infoSala.participantes;
    this.infoSala.participantes.splice(this.infoSala.participantes.indexOf(idUser), 1);
    if (this.infoSala.admins.includes(idUser)) {
      this.infoSala.admins.splice(this.infoSala.admins.indexOf(idUser), 1);
    }
    await this.db.collection('salas').doc(this.idSala)
    .update(this.infoSala).then( () => {
      // console.log('Sala actualizada');
      // Borrar sala del usuario
    });
    await this._user.deleteUserSala(this.idSala, idUser);
    await this._producto.deleteUserTodosProductos(this.idSala, idUser);
    if (this.myUID === idUser) {
      this.salirSala();
    }
  }

  async cambioNombreSala(nombre: string) {
    // console.log('cambio nombre sala');
    const loadingg = await this.uiCtrl.presentLoading('Cambiando nombre');
    await this.db.collection('salas').doc(this.idSala).update({
      nombre
    }).then( () => {
      // console.log('nombre cambiado');
    });
    this.uiCtrl.dismisLoading(loadingg);
  }

  async cambiarEstado(open: boolean) {
    // console.log('cambiar estado sala');
    let msg;
    if (open) {
      msg = 'Abriendo sala';
    } else {
      msg = 'Cerrando sala';

    }
    const loadingg = await this.uiCtrl.presentLoading(msg);
    // console.log('OPEN: ', open);
    await this.db.collection('salas').doc(this.idSala).update({
      open
    }).then(() => {
      // console.log('cambiando estado de la sala', open);
    });
    this.uiCtrl.dismisLoading(loadingg);
  }

  async addAdmin(idUser: string) {
    // console.log('add admin');
    if (this.infoSala.admins.includes(idUser)) {
      return;
    }

    this.infoSala.admins.unshift(idUser);
    const loadingg = await this.uiCtrl.presentLoading('Añadiendo administrador');
    await this.db.collection('salas').doc(this.idSala).update({
      admins: this.infoSala.admins
    }).then(() => {
      // console.log('añadiendo admin');
    });
    this.uiCtrl.dismisLoading(loadingg);
  }


  async deleteAdmin(idUser: string) {
    // console.log('delete admin');
    if (!this.infoSala.admins.includes(idUser)) {
      return;
    }

    this.infoSala.admins.splice(this.infoSala.admins.indexOf(idUser), 1);
    const loadingg = await this.uiCtrl.presentLoading('Borrando administrador');
    await this.db.collection('salas').doc(this.idSala).update({
      admins: this.infoSala.admins
    }).then(() => {
      // console.log('borrado admin');
    });
    this.uiCtrl.dismisLoading(loadingg);
  }


  async borrarSala() {
    // console.log('borrar sala');
    const loadingg = await this.uiCtrl.presentLoading('Borrando sala');
    this.infoSala.participantes.forEach(async user => {
      // if (user !== this.infoSala.owner) {
        await this._user.deleteUserSala(this.idSala, user);
        if (this.myUID === user) {
          this.salirSala();
        }
      // }
    });
    await this.db.collection('salas').doc(this.idSala).delete();
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
}
