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

  ngOnInit() {}

  ngAfterViewInit(){
    this.slides.lockSwipes( true );
  }


  async login(login: NgForm) {
    if ( login.invalid ) { return; }
    await this._auth.login(this.loginUser.email, this.loginUser.password);
  }


  async registro( reg: NgForm) {
    if (reg.invalid) { return; }
    this.registrando = true;
    await this._auth.register( this.registroUser );
    this.registrando = false;
  }



  mostrarReg( form: NgForm) {
    form.resetForm();
    this.enLogin = false;
    this.slides.lockSwipes( false );
    this.slides.slideTo(2);
    this.slides.lockSwipes( true );

  }

  mostrarLogin( form: NgForm ) {
    form.resetForm();

    this.enLogin = true;

    this.slides.lockSwipes( false );
    this.slides.slideTo(0);
    this.slides.lockSwipes( true );

  }

  async resetPass() {
    await this._auth.resetPass(this.loginUser.email);
  }
}
