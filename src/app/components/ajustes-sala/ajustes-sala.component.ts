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
  descSala: string;
  myUid: string;
  subHaySala: Subscription;
  nombreBot = '';
  showSlides = false;
  img: string;

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController,
              private _sala: SalaService,
              private uiCtrl: UiServiceService) { }

  ngOnDestroy() {
    if (this.subHaySala) {
      this.subHaySala.unsubscribe();
    }
  }

  ngOnInit() {
    this.subHaySala = this._sala.haySala.subscribe( (sala: Sala) => {
      if (sala) {
        this.config(sala);
      }
    });
    this.config(this._sala.infoSala);
  }

  config(info: Sala) {
    this.infoSala = info;
    this.nombreSala = this.infoSala.nombre.toString();
    this.img = this.infoSala.img;
    if (this.infoSala.desc) {
      this.descSala = this.infoSala.desc.toString();
    } else {
      this.descSala = '';
    }
    this.myUid = this._sala.myUID;
  }

  ionViewDidEnter() {
    this.showSlides = true;
}

  async cambiarNombre(f: NgForm){
    if (f.invalid) {
      return;
    }
    await this._sala.cambioNombreSala(this.nombreSala);
  }

  async cambiarDescSala(f: NgForm){
    if (f.invalid) {
      return;
    }
    await this._sala.cambioDescSala(this.descSala);
  }

  async estadoSala() {
    await this._sala.cambiarEstado(!this.infoSala.open);
  }

  async cambiarImgSala() {
    await this._sala.cambioImgSala(this.img);
  }

  me(idUser: string) {
    if (idUser === this.infoSala.owner || idUser === this._sala.myUID) {
      return false;
    } else {
      return true;
    }
  }

  role(idUser: string) {
    if (this.infoSala.admins.includes(idUser)) {
      return true;
    } else {
      return false;
    }
  }

  async deleteUser(idUser: string) {
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

  async addAdmin(idUser: string) {
    await this._sala.addAdmin(idUser);
  }

  async deleteAdmin(idUser: string) {
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


  async crearBot() {
    if (this.nombreBot.length < 4 ||  this.nombreBot.length > 16) {
      this.uiCtrl.presentAlert('El nombre del bot debe tener entre 4 y 16 caracteres');
      return;
    }
    const loading = await this.uiCtrl.presentLoading('Creando Bot');
    this._sala.addBotSala(this.nombreBot);
    await this.uiCtrl.dismisLoading(loading);
    this.nombreBot = '';
  }



}
