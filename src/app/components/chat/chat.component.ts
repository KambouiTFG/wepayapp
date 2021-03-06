import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { SalaService } from '../../services/sala.service';
import { Mensaje } from '../../interfaces/interfaces';
import { ChatService } from '../../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  divChatt;
  
  chat: Mensaje[] = [];

  subChat: Subscription;

  usuario = this._sala.myUID;
  newMsg = '';
  constructor(public _user: UsuarioService,
              private _sala: SalaService,
              private _chat: ChatService) { }

  ngOnInit() {
    this.divChatt = document.getElementById('chatt');
    this._sala.haySala.subscribe((r: any) => {
      if (r) {
        this.cargarMensajes();
        this.chatBottom();
      } else {
        this.salioSala();
      }
    });
    this.cargarMensajes();
    this.chatBottom();
  }

  enviarMsg() {
    this._chat.addMsg(this.newMsg.trim());
    this.newMsg = '';
    this.chatBottom();
  }


  cargarMensajes(){
    this.subChat = this._chat.cargarMensajes().subscribe( r => {
      this.chat = r;
      this.chatBottom();
    });
  }



  salioSala(){
    if (this.subChat) {
      this.subChat.unsubscribe();
    }
  }

  chatBottom() {
    setTimeout(() => {
      this.divChatt.scrollTop = this.divChatt.scrollHeight;
    }, 200);
  }

}
