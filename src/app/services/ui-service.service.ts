import { EventEmitter, Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Producto, Sala } from '../interfaces/interfaces';
import { ModalProductoComponent } from '../components/modal-producto/modal-producto.component';
import { ModalCrearProductoComponent } from '../components/modal-crear-producto/modal-crear-producto.component';

@Injectable({
  providedIn: 'root'
})
export class UiServiceService {

  Confirm  = new EventEmitter();

  constructor(private toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {

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

   async presentModalProducto(producto: Producto, idSala: string, role: number) {
    const modal = await this.modalCtrl.create({
      component: ModalProductoComponent,
      componentProps: {
        infoProducto: producto,
        idSala,
        role
      }
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    // console.log(data);
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  async presentModalCrearProducto(idSala: string) {
    const modal = await this.modalCtrl.create({
      component: ModalCrearProductoComponent,
      componentProps: {
        idSala
      }
    });
    await modal.present();

    const {data} = await modal.onDidDismiss();
    if (data) {
      return data.producto;
    } else {
      return null;
    }
  }

  

}
