import { EventEmitter, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Sala } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { UiServiceService } from './ui-service.service';
import { Subscription } from 'rxjs';
import { ProductoService } from './producto.service';


@Injectable({
  providedIn: 'root'
})
export class SalaService {
  haySala = new EventEmitter();
  idSala = '';
  infoSala: Sala = {};
  myUID = null;
  salaSub: Subscription;

  
  constructor(private navCtrl: NavController,
              private db: AngularFirestore,
              private _user: UsuarioService,
              private uiCtrl: UiServiceService,
              private _producto: ProductoService) { }

  async seleccionarSala(idSala: string) {
    // this.haySala.emit(idSala);
    this.idSala = idSala;
    await this.getActualInfoSala();
  }

  salirSala() {
    this.haySala.emit(null);
    if (this.salaSub) {
      console.log('CANCELAMOS SUBSCRIPTION');
      this.salaSub.unsubscribe();
    }
    this.navCtrl.navigateRoot('/main/tabs/home');
  }

  setUsuario(uid: string) {
    (uid) ? this.myUID = uid : this.myUID = null;
  }


  async grabarSala(nombre: string) {
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
      console.log('Sala añadida la BD');
      await this._user.addSalaMyUser(r.id);
      await this.seleccionarSala(r.id);
    });
  }

  async getInfoSala(salaId: string) {
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
  }
  

  async getActualInfoSala() {
    const loadingg = await this.uiCtrl.presentLoading('Entrando en sala');
    this._producto.getProducoInfo(this.idSala);
    this.salaSub = this.db.collection('salas').doc(this.idSala).valueChanges()
    .subscribe( (r: Sala) => {
      if (r) {
        this.infoSala = r;
        this.haySala.emit(this.infoSala);
        this.navCtrl.navigateRoot('/main/tabs/room');
      } else {
        this.infoSala = null;
        console.log('No hay sala', r);
        // this.haySala.emit('');
      }
      this.uiCtrl.dismisLoading(loadingg);
    });
  }

  async buscarSala(code: string) {
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
        console.log('qué sale antes?');
      });

    } else {
      await this.uiCtrl.presentAlert('Sin resultados');
    }
  }

  // Añadir usuario a una sala
  async addSalaUser(idSala: string, idUser: string) {
    let infoSala = await this.getInfoSala(idSala);
    const arrTemp: string[] = infoSala.participantes;
    arrTemp.push(idUser);
    await this.db.collection('salas').doc(idSala).update({
      participantes: arrTemp
    }).then( () => {
      console.log('Sala actualizada');
    });
  }
  // Borrar usuario de una sala
  async deleteSalaUser(idUser: string) {
    // const arrTemp: string[] = this.infoSala.participantes;
    this.infoSala.participantes.splice(this.infoSala.participantes.indexOf(idUser), 1);
    if (this.infoSala.admins.includes(idUser)) {
      this.infoSala.admins.splice(this.infoSala.admins.indexOf(idUser), 1);
    }
    await this.db.collection('salas').doc(this.idSala)
    .update(this.infoSala).then( () => {
      console.log('Sala actualizada');
      // Borrar sala del usuario
    });
    await this._user.deleteUserSala(this.idSala, idUser);
    await this._producto.deleteUserTodosProductos(this.idSala, idUser);
    this.salirSala();
  }


}
