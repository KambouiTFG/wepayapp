import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
import { SalaService } from 'src/app/services/sala.service';
import { Sala } from '../../interfaces/interfaces';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  @ViewChild( 'mainSlide') slides: IonSlides;

  infoSala: Sala;
  sIndex = 1;
  myUid;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(private _sala: SalaService,
              private alertCtrl: AlertController) { }



  ngOnInit() {
    this._sala.haySala.subscribe( r => {
      // console.log('Hay cambio', r);
      this.myUid = this._sala.myUID;
      this.infoSala = r;
      this.irSlide(1);
      console.log('infoSala', this.infoSala);
      // console.log('idSala', this._sala.idSala);
    });
    this.myUid = this._sala.myUID;
    this.infoSala = this._sala.infoSala;
    console.log('infoSala', this.infoSala);


  }

  ngAfterViewInit(){
    this.slides.lockSwipes( true );
  }

  irSlide(i: number) {
    this.sIndex = i;
    this.slides.lockSwipes( false );
    this.slides.slideTo(this.sIndex);
    this.slides.lockSwipes( true );
  }

  role(idUser: string) {
    if (idUser === this.infoSala.owner) {
      return 2;
    } else if ( this.infoSala.admins.includes(idUser)) {
      return 1;
    } else {
      return 0;
    }
  }

  salir() {
    this._sala.salirSala();
  }


  abandonarSala() {
    this._sala.deleteSalaUser(this.myUid);
  }

  async presentAlertConfirmAbandonarSala() {
    const alert = await this.alertCtrl.create({
      message: '¿Seguro que quiere abandonar la sala?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Borrar',
          handler: () => {
            this.abandonarSala();
          }
        }
      ]
    });
    await alert.present();
  }


}
