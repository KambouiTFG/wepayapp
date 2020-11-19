import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { Subscription } from 'rxjs';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-item-sala',
  templateUrl: './item-sala.component.html',
  styleUrls: ['./item-sala.component.scss'],
})
export class ItemSalaComponent implements OnInit, OnDestroy {

  @Input() idSala: string;
  @Input() gastos = false;
  @Output() sumaGasto = new EventEmitter();

  infoSala;
  owner = false;
  admin = false;
  part = 0;
  subCambio: Subscription;
  subGastos: Subscription;


  constructor(private _sala: SalaService,
              private _producto: ProductoService ) { }
  ngOnDestroy() {
    if (this.subCambio) {
      this.subCambio.unsubscribe();
    }

    if (this.subGastos) {
      this.subGastos.unsubscribe();
    }
  }

  ngOnInit() {
    if (this._sala.myUID === null){
      return;
    }
    if ( this.gastos ) {
      this.subGastos = this._producto.getGasto(this.idSala).subscribe( p => {
        p.forEach( producto => {
          if (producto.data().participantes.includes(this._sala.myUID)) {
            this.part += (producto.data().precio * producto.data().unidad)
                         / producto.data().participantes.length;
          }
        });
        this.sumaGasto.emit(this.part);
      });
    }

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
    if (!this.infoSala) {
      return;
    }
    if (this._sala.myUID === this.infoSala.owner) {
      this.owner = true;
    }
    if (this.infoSala.admins.includes(this._sala.myUID)) {
      this.admin = true;
    }
  }
}
