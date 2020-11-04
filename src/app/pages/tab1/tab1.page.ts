import { Component, OnInit } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { NgForm } from '@angular/forms';
import { UiServiceService } from '../../services/ui-service.service';
import { UsuarioService } from '../../services/usuario.service';
import { User } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  nombreSala = '';
  codigoSala = '';
  myInfo: User = {};
  haySalas = false;

  constructor(public _sala: SalaService,
              private uiCtrl: UiServiceService,
              private _user: UsuarioService) {

              }

  async ngOnInit() {
    this._user.hayUser.subscribe( r => {
      this.myInfo = r;
      if (this._sala.idSala !== '' && !this._user.myInfo.salas.includes(this._sala.idSala)) {
        this._sala.salirSala();
        this.uiCtrl.alertaInformativa('Ya no perteneces a esta sala');
      }
      if (this.myInfo.salas.length !== 0) {
        this.haySalas = true;
      } else {
        this.haySalas = false;
      }
      // console.log(this.myInfo);
    });
  }

  haySala() {
    // this._sala.seleccionarSala();
  }

  async crearSala() {
    if (this.nombreSala.length < 4 ) {
      this.uiCtrl.presentAlert('El nombre de la sala debe tener entre 4 y 16 caracteres');
      return;
    }
    const loading = await this.uiCtrl.presentLoading('Creando Sala');
    await this._sala.grabarSala(this.nombreSala);
    await this.uiCtrl.dismisLoading(loading);
    this.nombreSala = '';
  }

  async buscarSala() {
    if (this.codigoSala.length !== 7 &&  this.codigoSala.length !== 6) {
      await this.uiCtrl.presentAlert('El tamaño del código es de 6 o 7 caracteres');
      return;
    }
    await this._sala.buscarSala(this.codigoSala);
    this.codigoSala = '';
  }

  irSala(idSala: string) {
    // console.log('Sala seleccionada: ', idSala);
    this._sala.seleccionarSala(idSala);
  }
}
