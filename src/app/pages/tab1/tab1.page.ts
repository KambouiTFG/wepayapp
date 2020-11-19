import { Component, OnInit } from '@angular/core';
import { SalaService } from '../../services/sala.service';
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
  misSalas = [];

  constructor(public _sala: SalaService,
              private uiCtrl: UiServiceService,
              private _user: UsuarioService) { }

  async ngOnInit() {
    this._user.hayUser.subscribe( (user: User) => {
      this.config(user);
    });
  }

  ngAfterViewInit() {
    this.misSalas = this._user.getMisSalas();
  }

  config(user: User) {
    this.myInfo = user;
    this.misSalas = this.myInfo.salas;
    if (this._sala.idSala !== '' && !this._user.myInfo.salas.includes(this._sala.idSala)) {
      this._sala.salirSala();
      this.uiCtrl.alertaInformativa('Ya no perteneces a esta sala');
    }
  }

  async crearSala() {
    if (this.nombreSala.length < 4 ||  this.nombreSala.length > 16) {
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
    this._sala.seleccionarSala(idSala);
  }
}
