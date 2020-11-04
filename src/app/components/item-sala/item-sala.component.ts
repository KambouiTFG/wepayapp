import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-sala',
  templateUrl: './item-sala.component.html',
  styleUrls: ['./item-sala.component.scss'],
})
export class ItemSalaComponent implements OnInit, OnDestroy {

  @Input() idSala;
  infoSala;
  owner = false;
  admin = false;
  subCambio: Subscription;

  constructor(private _sala: SalaService) { }
  ngOnDestroy() {
    if (this.subCambio) {
      this.subCambio.unsubscribe();
    }
  }

  ngOnInit() {
    /* this._sala.getInfoSala(this.idSala).then( r => {
      this.infoSala = r;
      this.tienePoder();
      // console.log(this.infoSala);
    }); */
    // this.infoSala = this._sala.getInfoSala(this.idSala);

    if (this._sala.myUID === null){
    };
    this.subCambio = this._sala.cambio.subscribe( (r) => {
      if (r) {
        this.infoSala = this._sala.getInfoSala(this.idSala);
        this.tienePoder();
      }
      

    });
    this.infoSala = this._sala.getInfoSala(this.idSala);
    this.tienePoder();
  }

  tienePoder(){
    if (this._sala.myUID === this.infoSala.owner) {
      this.owner = true;
    }
    if (this.infoSala.admins.includes(this._sala.myUID)) {
      this.admin = true;
    }
  }

}
