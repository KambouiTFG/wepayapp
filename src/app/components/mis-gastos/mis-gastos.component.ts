import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SalaService } from '../../services/sala.service';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.component.html',
  styleUrls: ['./mis-gastos.component.scss'],
})
export class MisGastosComponent implements OnInit {
  @Input() Salas: string[];
  gastoTotal = 0;


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    console.log(this.Salas);
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  sumaGasto(gasto: number) {
    this.gastoTotal += gasto;
  }


}
