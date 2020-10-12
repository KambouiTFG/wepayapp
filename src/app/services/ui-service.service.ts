import { EventEmitter, Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Sala } from '../interfaces/interfaces';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  Confirm  = new EventEmitter();

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {

               }

  async alertaInformativa(message) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }


  async presentLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      cssClass: 'spinner-class'
    });
    await loading.present();
    return loading;
  }

  async dismisLoading(loading: any) {
    await loading.dismiss();
  }


  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      buttons: ['OK']
    });

    await alert.present();
  }

  async presentAlertConfirm(infoSala: Sala, idSala: string) {
    const message = `Nombre: ${infoSala.nombre}\n
                    Participantes: ${infoSala.participantes.length}`;
    const alert = await this.alertCtrl.create({
      header: 'Sala encontrada',
      message,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Unirme',
          handler: () => {
            this.Confirm.emit(idSala);
          }
        }
      ]
    });
    await alert.present();
  }

}
