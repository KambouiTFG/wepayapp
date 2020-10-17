import { Component, Input, OnInit } from '@angular/core';
import { SalaService } from '../../services/sala.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../interfaces/interfaces';
import { UiServiceService } from '../../services/ui-service.service';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss'],
})
export class ListaProductosComponent implements OnInit {

  @Input() role;
  @Input() idUser;
  productos: Producto[];
  total = 0;
  miPart = 0;

  constructor(private _sala: SalaService,
              private _producto: ProductoService,
              private _uiCtrl: UiServiceService) { }

  ngOnInit() {
    /* this._sala.haySala.subscribe( (r) => {
      if (r) {
        this.productos = this._producto.productos;
        console.log('misProductos', this.productos);
      }
      
    }); */
    this._producto.hayProducto.subscribe( r => {
      this.productos = r;
      this.calculaTotal();
      this.calculaMiPart();

    });
    this.productos = this._producto.productos;
    // console.log('misProductos', this.productos);
    this.calculaTotal();
    this.calculaMiPart();

  }

/*   async modal(idProduct: string) {
    await this._uiCtrl.presentModalProducto(idProduct);
  } */

  async CrearProducto() {
    const newProducto = await this._uiCtrl.presentModalCrearProducto(this._sala.idSala);
    if ( newProducto ) {
      this.guardarProducto(newProducto, true);
    }
  }

  async verDetalles(producto: Producto) {
    const infoProducto = await this._uiCtrl.presentModalProducto(producto, this._sala.idSala, this.role);
    // console.log(infoProducto);
    if (infoProducto) {
      if (infoProducto.borrar) {
        // console.log('borrar', infoProducto);
        await this.borrarProducto(infoProducto.producto);
      } else {
        // console.log('producto ', infoProducto);
        this.guardarProducto(infoProducto.producto, false);
      }
    }
  }


  async guardarProducto(producto: Producto, nuevo: boolean) {
    if (nuevo) {
      producto.participantes = this._sala.infoSala.participantes;
      await this._producto.añadirProducto(this._sala.idSala, producto);
    } else {
      await this._producto.actualizarProducto(this._sala.idSala, producto);
    }
  }

  async borrarProducto(producto: Producto) {
    await this._producto.borrarProducto(this._sala.idSala, producto);
  }

  

  calculaTotal() {
    this.total = 0;
    this.productos.forEach(producto => {
      if ( producto.participantes.length > 0) {
        this.total += producto.precio * producto.unidad;
      }
    });
    //console.log('TOTAL: ', this.total);
  }

  calculaMiPart() {
    this.miPart = 0;
    this.productos.forEach(producto => {
      if (producto.participantes.includes(this.idUser)) {
        this.miPart += (producto.precio * producto.unidad) / producto.participantes.length;
      }
    });
    // console.log('MiPart: ', this.miPart);
  }
}
