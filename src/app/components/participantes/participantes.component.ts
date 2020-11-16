import { AfterContentInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { SalaService } from '../../services/sala.service';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss'],
})
export class ParticipantesComponent implements OnInit {

  @Input() idUser: string;
  @Input() role: number;
  infoUser;
  constructor(private _user: UsuarioService,
              private _sala: SalaService) { }

  ngOnInit() {
    /* this._sala.haySala.subscribe(() => {
      this.haySala = true;
    }); */

    this._user.hayCambio.subscribe((r) => {
      if (r) {
        // console.log('CAMBIO en participantes');
        // this.infoUser = this._user.getNombre(this.idUser);
        if (!this.idUser.includes('-')) {
          this.infoUser = this._user.getNombre(this.idUser);
        } else {
          this.infoUser = {
            nombre: this.idUser.split('-')[1],
            avatar: 'bot.png'
          };
        }
      }
    });
    // console.log('PARTICIPANTES CPM', this.idUser);
    // this.infoUser = this._user.getNombre(this.idUser);
    if (!this.idUser.includes('-')) {
      this.infoUser = this._user.getNombre(this.idUser);
    } else {
      this.infoUser = {
        nombre: this.idUser.split('-')[1],
        avatar: 'bot.png'
      };
    }
  }
}
