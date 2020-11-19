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
    this._user.hayCambio.subscribe((r: any) => {
      if (r) {
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
