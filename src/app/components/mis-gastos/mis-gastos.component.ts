import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mis-gastos',
  templateUrl: './mis-gastos.component.html',
  styleUrls: ['./mis-gastos.component.scss'],
})
export class MisGastosComponent implements OnInit {
  @Input() Salas: string[];
  gastoTotal = 0;


  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  salir() {
    this.modalCtrl.dismiss();
  }

  sumaGasto(gasto: number) {
    this.gastoTotal += gasto;
  }
}
