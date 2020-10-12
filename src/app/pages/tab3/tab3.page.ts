import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import { User } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  @ViewChild('focuss') newName: IonInput;

  edit = false;
  avatar = 'av-1.png';
  actualizando = false;
  usuario: User;

  constructor(private _user: UsuarioService,
              private _uiCtrl: UiServiceService) {
    
  }

  async ngOnInit() {
    // const loadingg = await this._uiCtrl.presentLoading('Cargando datos');
    /* this._user.getMyInfo().subscribe( async (r: User) => {
      if (r) {
        this.usuario = r;
        await this._uiCtrl.dismisLoading(loadingg);
        this.avatar = r.avatar;
      }
    }); */
    this.usuario = this._user.myInfo;
    this._user.hayUser.subscribe( r => {
      this.usuario = r;
      console.log('q paso');
    });
    // await this._uiCtrl.dismisLoading(loadingg);

    /* this._user.hayUser.subscribe( r => {
      console.log(r);
    }); */
  }

  dameFecha(ms: number) {
    const creado = new Date(ms);
    let dia: string;
    let mes: string;
    if (creado.getDate() < 10 ){
      dia = `0${creado.getDate()}`;
    } else {
      dia = `${creado.getDate()}`;
    }
    if ((creado.getMonth() + 1) < 10 ){
      mes = `0${creado.getMonth() + 1}`;
    } else {
      mes = `${creado.getMonth() + 1}`;
    }
    return `${dia}/${mes}/${creado.getFullYear()}`;
  }

  ionViewDidLeave(){
    this.edit = false;
  }

  async actualizar() {
    this.actualizando = true;
    if ( this.newName.value.toString().localeCompare(this.usuario.nombre) || this.avatar !== this.usuario.avatar) {
      this.usuario.nombre = this.newName.value.toString();
      this.usuario.avatar = this.avatar;
      console.log('cambiar');
      await this._user.userUpdate('', this.usuario);
    } else {
      console.log('no cambiamo na');
    }
    this.edit = false;
    this.actualizando = false;
  }

   editar() {

    this.edit = !this.edit;
    this.avatar = this.usuario.avatar;
    if (this.edit) {
      setTimeout(() => {
        this.newName.setFocus();
      }, 150);
    }
    
    // console.log(this.newName);
  }

}
