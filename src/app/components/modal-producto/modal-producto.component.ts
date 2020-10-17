import { Component, Input, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { UiServiceService } from '../../services/ui-service.service';
import { ModalController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { Producto } from 'src/app/interfaces/interfaces';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss'],
})
export class ModalProductoComponent implements OnInit {

  constructor(private modalCtrl: ModalController,
              private alertCtrl: AlertController) { }

  @Input() infoProducto;
  @Input() idSala;
  @Input() role;
  
  producto: Producto = {};

  edit = false;

  ngOnInit() {
    // console.log(this.producto, this.idSala);
    // this.producto = {...this.infoProducto};
    this.producto = JSON.parse(JSON.stringify(this.infoProducto));
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  async crearProducto(f: NgForm) {
    if ( JSON.stringify(this.producto) ===  JSON.stringify(this.infoProducto)) {
      console.log('Son iguales');
      this.salir();
    }
    if (this.producto.categoria.length === 0) {
      f.controls.categoriaProducto.setErrors({'incorrect': true});
    }

    if (this.producto.nombre.length < 3) {
      f.controls.nombreProducto.setErrors({'incorrect': true});
    }

    if (this.producto.precio <= 0) {
      f.controls.precioProducto.setErrors({'incorrect': true});
    }

    if (this.producto.precio <= 0) {
      f.controls.unidadProducto.setErrors({'incorrect': true});
    }

    if (f.invalid) {
      console.log('invalid');
      return;
    }
    console.log('valido', this.producto);
    await this.guardarProducto();
  }

  async guardarProducto() {
    this.modalCtrl.dismiss({producto: this.producto, borrar: false});
  }

  async borrarProducto() {
    await this.presentAlertConfirmBorrarProducto();
  }

  editar() {
    this.edit = !this.edit;
  }

  async presentAlertConfirmBorrarProducto() {
    const alert = await this.alertCtrl.create({
      message: '¿Seguro que quiere borrar este producto?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, {
          text: 'Borrar',
          handler: () => {
            this.modalCtrl.dismiss({producto: this.producto, borrar: true});
          }
        }
      ]
    });
    await alert.present();
    console.log(await alert.onDidDismiss());
  }


  addPart(idUser: string) {
    //this.AllParticipantes.splice(this.AllParticipantes.indexOf(uid), 1);
    this.producto.participantes.unshift(idUser);
    
  }

  quitarPart(idUser: string) {
    //this.AllParticipantes.unshift(uid);
    this.producto.participantes.splice(this.producto.participantes.indexOf(idUser), 1);
  }


}
