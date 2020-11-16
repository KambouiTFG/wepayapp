import { EventEmitter, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Producto } from '../interfaces/interfaces';
import { UiServiceService } from './ui-service.service';
import { Subscription } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  productos: Producto[] = [];
  hayProducto = new EventEmitter();
  newUser = '';

  subSupremo: Subscription;


  constructor(private db: AngularFirestore,
              private uiCtrl: UiServiceService) { }

  getProducoInfo(idSala: string) {
    this.subSupremo = this.db.collection('salas').doc(idSala)
    .collection('productos').valueChanges({ idField: 'propertyId' })
    .subscribe( (r: any[]) => {
      this.productos = r;
      this.hayProducto.emit( this.productos );
      if (this.newUser.length > 0) {
        this.addUserTodosProductos(idSala, this.newUser);
        this.newUser = '';
      }
      // console.log('suscripcion', r);
    });
  }

  pararSub(){
    if (this.subSupremo) {
      this.subSupremo.unsubscribe();
    }
  }


  async añadirProducto(idSala: string, newProducto: Producto){
    const loading = await this.uiCtrl.presentLoading('Guardando producto');
    await this.db.collection('salas').doc(idSala).collection('productos').add(newProducto);
    this.uiCtrl.dismisLoading(loading);
  }

  async actualizarProducto(idSala: string, producto: Producto){
    const idProducto = producto.propertyId;
    delete(producto.propertyId);
    const loading = await this.uiCtrl.presentLoading('Actualizando producto');
    await this.db.collection('salas').doc(idSala).collection('productos')
    .doc(idProducto).update(producto);
    this.uiCtrl.dismisLoading(loading);
  }

  async borrarProducto(idSala: string, producto: Producto){
    const loading = await this.uiCtrl.presentLoading('Borrando producto');
    await this.db.collection('salas').doc(idSala).collection('productos')
    .doc(producto.propertyId).delete();
    this.uiCtrl.dismisLoading(loading);
  }


  async addUserTodosProductos(idSala: string, idUser: string) {
    // console.log('Estamo dentro', this.productos);
    await this.productos.forEach(async p => {
      const idProducto = p.propertyId;
      const participantes = p.participantes;
      if (!participantes.includes(idUser)) {
        participantes.unshift(idUser);
      }
      await this.db.collection('salas').doc(idSala)
      .collection('productos').doc(idProducto).update({
        participantes
      }).then( () => {
        // console.log('usuario añadido al producto');
      }).catch( e => {
        // console.log('falló la operación');
      });
    });
  }


  async deleteUserTodosProductos(idSala: string, idUser: string) {
    await this.productos.forEach(async p => {
      const idProducto = p.propertyId;
      const participantes = p.participantes;
      if (participantes.includes(idUser)) {
        participantes.splice(participantes.indexOf(idUser), 1);
      }
      await this.db.collection('salas').doc(idSala)
      .collection('productos').doc(idProducto).update({
        participantes
      }).then( () => {
        // console.log('usuario borrado del producto');
      }).catch( e => {
        // console.log('falló la operación');
      });
    });
  }

  async getInfoProductos(idSala: string, idUser: string) {
    /* this.db.collection('salas').doc(idSala).collection('productos')
    .get().forEach( r => {
      r.forEach( r => {
        console.log(r.);
      })
    }); */
    
    
    /* await this.productos.forEach(async p => {
      const idProducto = p.propertyId;
      const participantes = p.participantes;
      if (participantes.includes(idUser)) {
        participantes.splice(participantes.indexOf(idUser), 1);
      }
      await this.db.collection('salas').doc(idSala)
      .collection('productos').doc(idProducto).update({
        participantes
      }).then( () => {
        console.log('usuario borrado del producto');
      }).catch( e => {
        console.log('falló la operación');
      });
    }); */
  }

  getGasto(idSala: string){
    return this.db.collection('salas').doc(idSala).collection('productos').get();
    
    
    /* .toPromise();
    let part = 0;
    data.forEach((producto) => {
      if (producto.data().participantes.includes(idUser)) {
        part += (producto.data().precio * producto.data().unidad) / producto.data().participantes.length;
      }
    });
    return part; */
  }




}
