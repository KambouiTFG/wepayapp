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

  async ngOnInit() {
    this._sala.haySala.subscribe(async () => {
      this.infoUser = await this._user.getInfoUser(this.idUser);
    });
    // console.log('PARTICIPANTES CPM', this.idUser);
    this.infoUser = await this._user.getInfoUser(this.idUser);
  }
}
