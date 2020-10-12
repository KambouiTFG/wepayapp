import { Component, Input, OnInit } from '@angular/core';
import { SalaService } from '../../services/sala.service';

@Component({
  selector: 'app-item-sala',
  templateUrl: './item-sala.component.html',
  styleUrls: ['./item-sala.component.scss'],
})
export class ItemSalaComponent implements OnInit {

  @Input() idSala;
  infoSala;
  owner = false;
  admin = false;

  constructor(private _sala: SalaService) { }

  ngOnInit() {
    this._sala.getInfoSala(this.idSala).then( r => {
      this.infoSala = r;
      this.tienePoder();
      // console.log(this.infoSala);
    });
  }

  tienePoder(){
    if (this._sala.myUID === this.infoSala.owner) {
      this.owner = true;
    }
    if (this.infoSala.admins.indexOf(this._sala.myUID) >= 0) {
      this.admin = true;
    }
  }

}
