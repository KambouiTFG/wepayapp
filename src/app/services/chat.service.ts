import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Mensaje } from '../interfaces/interfaces';
import { SalaService } from './sala.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private db: AngularFirestore,
              private _sala: SalaService) { }

  async addMsg(msg: string) {
    const mensaje: Mensaje = {
      msg,
      idUser: this._sala.myUID,
      date: new Date().getTime()
    };
    return await this.db.collection('salas').doc(this._sala.idSala).collection('mensajes').add(mensaje);
  }

  cargarMensajes() {
    return this.db.collection('salas').doc(this._sala.idSala)
    .collection<Mensaje>('mensajes', ref => ref.orderBy('date', 'asc').limit(100)).valueChanges();
  }
}
