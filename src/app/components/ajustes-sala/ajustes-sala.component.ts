import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { Sala } from '../../interfaces/interfaces';
import { SalaService } from '../../services/sala.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ajustes-sala',
  templateUrl: './ajustes-sala.component.html',
  styleUrls: ['./ajustes-sala.component.scss'],
})
export class AjustesSalaComponent implements OnInit, OnDestroy {

  infoSala: Sala;
  nombreSala: string;
  myUid: string;
  subHaySala: Subscription;

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private _sala: SalaService,
              private uiCtrl: UiServiceService) { }

  ngOnDestroy() {
    console.log('DESTRUCCION ajusteSala');
    if (this.subHaySala) {
      this.subHaySala.unsubscribe();
    }
  }

  ngOnInit() {
    this.subHaySala = this._sala.haySala.subscribe( (r) => {
      console.log('cambio', r);
      if (r) {
        this.infoSala = r;
        this.nombreSala = this.infoSala.nombre.toString();
        this.myUid = this._sala.myUID;
      }
    });
    this.infoSala = this._sala.infoSala;
    this.nombreSala = this.infoSala.nombre.toString();
    this.myUid = this._sala.myUID;
  }

  async cambiarNombre(f: NgForm){
    if (f.invalid) {
      return;
    }
    //await this._sala.cambioNombreSala(this.nombreSala);
  }

  async estadoSala() {
    await this._sala.cambiarEstado(!this.infoSala.open);
  }

  me(idUser) {
    if (idUser === this.infoSala.owner || idUser === this._sala.myUID) {
      return false;
    } else {
      return true;
    }
  }

  role(idUser) {
    if (this.infoSala.admins.includes(idUser)) {
      return true;
    } else {
      return false;
    }
  }
  /* async deleteUser(idUser){
    await this._sala.deleteSalaUser(idUser);
  } */

  async deleteUser(idUser) {
    const alert = await this.alertCtrl.create({
      message: '¿Seguro que quiere eliminar este usuario?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Borrar',
          handler: async () => {
            await this._sala.deleteSalaUser(idUser);
          }
        }
      ]
    });
    await alert.present();
  }

  async addAdmin(idUser) {
    await this._sala.addAdmin(idUser);
  }

  async deleteAdmin(idUser) {
    const loading = await this.uiCtrl.presentLoading('Elmininando usuario');
    await this._sala.deleteAdmin(idUser);
    this.uiCtrl.dismisLoading(loading);

  }

  salir() {
    this.modalCtrl.dismiss();
  }


  async borrarSala() {
    const alert = await this.alertCtrl.create({
      message: '¿Seguro que borrar esta sala?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Borrar',
          handler: async () => {
            await this._sala.borrarSala();
            this.modalCtrl.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }



}
