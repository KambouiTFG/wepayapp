import { Component } from '@angular/core';
import { SalaService } from 'src/app/services/sala.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private _sala: SalaService) {}

    salirSala() {
    this._sala.salirSala();
  }

}
