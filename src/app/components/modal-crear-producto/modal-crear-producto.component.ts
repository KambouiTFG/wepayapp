import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Producto } from 'src/app/interfaces/interfaces';
import { NgForm } from '@angular/forms';
import { SalaService } from '../../services/sala.service';
import { ProductoService } from '../../services/producto.service';


@Component({
  selector: 'app-modal-crear-producto',
  templateUrl: './modal-crear-producto.component.html',
  styleUrls: ['./modal-crear-producto.component.scss'],
})
export class ModalCrearProductoComponent implements OnInit {

  constructor(private modalCtrl: ModalController/* ,
              private _producto: ProductoService */) { }

  producto: Producto = {
    nombre: '',
    descripcion: '',
    precio: null,
    categoria: '',
    unidad: null,
    participantes: []
  };
  // @Input() producto;
  @Input() idSala;

  ngOnInit() {}

  salir() {
    this.modalCtrl.dismiss();
  }


  async crearProducto(f: NgForm) {
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
      // console.log('invalid');
      return;
    }
    // console.log('valido', this.producto);
    await this.guardarProducto();
  }

  async guardarProducto() {
    this.modalCtrl.dismiss({producto: this.producto});
  }

}
