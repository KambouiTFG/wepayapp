import { Component, OnInit } from '@angular/core';
import { SalaService } from '../../services/sala.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{
  haySala = false;

  constructor(private _sala: SalaService) {}



  ngOnInit() {
    this._sala.haySala.subscribe( (r: string) => {
      if (r) {
        this.haySala = true;
      } else {
        this.haySala = false;
      }
    });
  }




}
