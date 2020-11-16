import { Component, Input, OnInit } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo: string;
  @Input() img?: string;
  @Input() sala = false;
  constructor(private _auth: AuthService,
              private _sala: SalaService) { }

  ngOnInit() {}

  logout() {
    this._sala.salirSala();
    this._auth.logout();
  }

  salirSala() {
    this._sala.salirSala();
  }

}
