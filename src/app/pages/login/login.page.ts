import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  enLogin = true;
  registrando = false;

  @ViewChild( 'mainSlide') slides: IonSlides;

  /* loginUser = {
    email: 'mohitaa@gmail.com',
    password: '123456'
  };
  
  registroUser = {
    email: 'mohitaa@gmail.com',
    password: '123456',
    nombre: 'mohitaa',
    avatar: 'av-1.png'
  }; */

  loginUser = {
    email: '',
    password: ''
  };
  
  registroUser = {
    email: '',
    password: '',
    nombre: '',
    avatar: 'av-1.png'
  };

  constructor(private _auth: AuthService) { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.slides.lockSwipes( true );
  }


  async login(login: NgForm) {
    console.log('Clickeado boton del login');
    if ( login.invalid ) { return; }
    await this._auth.login(this.loginUser.email, this.loginUser.password);
  }


  async registro( reg: NgForm) {
    if (reg.invalid) { return; }

    this.registrando = true;
    await this._auth.register( this.registroUser );
    this.registrando = false;
  }



  mostrarReg() {
    this.enLogin = false;
    this.slides.lockSwipes( false );
    this.slides.slideTo(1);
    this.slides.lockSwipes( true );

  }

  mostrarLogin() {
    this.enLogin = true;

    this.slides.lockSwipes( false );
    this.slides.slideTo(0);
    this.slides.lockSwipes( true );

  }


}
