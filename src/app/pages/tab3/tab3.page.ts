import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { User } from '../../interfaces/interfaces';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { AuthService } from '../../services/auth.service';
import { SalaService } from '../../services/sala.service';
import { ProductoService } from '../../services/producto.service';
import { MisGastosComponent } from '../../components/mis-gastos/mis-gastos.component';

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
  valido = true;

  constructor(private _user: UsuarioService,
              private _auth: AuthService,
              private _producto: ProductoService,
              private _sala: SalaService,
              private modalCtrl: ModalController) {
    
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
      if (!this.validar(this.newName.value.toString())) {
        this.actualizando = false;
        return;
      }
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

  validar(nombre: string) {
    console.log('NOMBRE: ', nombre);
    if (nombre.length >= 4 && nombre.length <= 16) {
      this.valido = true;
      return true;
    } else {
      this.valido = false;
      return false;
    }
  }

   editar() {
    this.valido = true;
    this.edit = !this.edit;
    this.avatar = this.usuario.avatar;
    if (this.edit) {
      setTimeout(() => {
        this.newName.setFocus();
      }, 150);
    }
    // console.log(this.newName);
  }

  resetPass() {
    this._auth.resetPass(this.usuario.email);
  }


  async misGastos() {
    const modal = await this.modalCtrl.create({
      component: MisGastosComponent,
      cssClass: 'my-custom-modal-css',
      componentProps: {
        Salas: this.usuario.salas
      }
    });
    await modal.present();
  }
}
