import { EventEmitter, Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { Sala } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';
import { UiServiceService } from './ui-service.service';
import { Subscription } from 'rxjs';


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
              private uiCtrl: UiServiceService) { }

  async seleccionarSala(idSala: string) {
    // this.haySala.emit(idSala);
    this.idSala = idSala;
    await this.getActualInfoSala();
  }

  async salirSala() {
    this.haySala.emit();
    if (this.salaSub) {
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
      productos : [],
      img : '',
      code: Math.random().toString(36).substr(6, 9),
      open: true,
      creado : new Date().getTime()
    };
    await this.db.collection('salas').add(newSala).then( async ( r ) => {
      // Actualizar usuario, añadir uid sala en arreglo Salas del usuario
      console.log('Sala añadida la BD');
      await this._user.addSalaMyUser(r.id);
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
    this.salaSub = this.db.collection('salas').doc(this.idSala).valueChanges()
    .subscribe( (r: Sala) => {
      if (r) {
        this.infoSala = r;
        this.haySala.emit(this.infoSala);
        this.navCtrl.navigateRoot('/main/tabs/room');
      } else {
        this.infoSala = null;
        console.log('hay algo?', r);
      }
      this.uiCtrl.dismisLoading(loadingg);
    });
  }

  async buscarSala(code: string) { //idField: 'propertyId' 
    const loadingg = await this.uiCtrl.presentLoading('Buscando sala');
    const busqueda: any = await new Promise( async (resolve) => {
      await this.db.collection('salas').ref.where('code', '==', code).where('open', '==', true)
      .get().then( r => r.forEach( rr => resolve({datos: rr.data(), idSala: rr.id})));
      resolve(null);
      this.uiCtrl.dismisLoading(loadingg);
    });

    // console.log('Resultado: ', busqueda);
    // console.log('MyID: ', this.myUID);
    // console.log('Estoy en la sala?', busqueda.datos.participantes.indexOf(this.myUID));
    // (busqueda) ? await this.uiCtrl.presentAlertConfirm(busqueda.datos) : await this.uiCtrl.presentAlert('Sin resultados');
    if (busqueda && busqueda.datos.participantes.indexOf(this.myUID) < 0) {
      await this.uiCtrl.presentAlertConfirm(busqueda.datos, busqueda.idSala);
      this.uiCtrl.Confirm.subscribe( async r => {
        await this._user.addSalaMyUser(r);
        await this.addSalaUser(r, this.myUID);
      });
    } else {
      await this.uiCtrl.presentAlert('Sin resultados');
    }
  }

  async addSalaUser(idSala: string, idUser: string) {
    let infoSala = await this.getInfoSala(idSala);
    const arrTemp: string[] = infoSala.participantes;
    arrTemp.unshift(idUser);
    await this.db.collection('salas').doc(idSala).update({
      participantes: arrTemp
    }).then( () => {
      console.log('Sala actualizada');
    });
  }


}
