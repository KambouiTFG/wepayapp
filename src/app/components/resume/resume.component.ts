import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SalaService } from '../../services/sala.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss'],
})
export class ResumeComponent implements OnInit {
  @Input() idSala;
  @Input() productos;
  participantes: string[] = [];

  constructor(private _sala: SalaService,
              private modalCtrl: ModalController,
              public _user: UsuarioService) { }

  async ngOnInit() {
    this.participantes = this._sala.getInfoSala(this.idSala).participantes;
  }


  calculaPart(idUser) {
    let part = 0;
    this.productos.forEach(producto => {
      if (producto.participantes.includes(idUser)) {
        part += (producto.precio * producto.unidad) / producto.participantes.length;
      }
    });
    return part;
  }

  getProductos(idUser) {
    const lista: string[] = [];
    this.productos.forEach(producto => {
      if (producto.participantes.includes(idUser)) {
        lista.push(producto.nombre);
      }
    });
    return lista;
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  getNombre(uid: string){
    if (uid.includes('-')) {
      return uid.split('-')[1];
    }
    return this._user.getNombre(uid).nombre;
  }

}
