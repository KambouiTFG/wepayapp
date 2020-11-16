import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonSlides, ModalController } from '@ionic/angular';
import { OtraPasswordComponent } from 'src/app/components/otra-password/otra-password.component';
import { AuthService } from '../../services/auth.service';
import { UiServiceService } from '../../services/ui-service.service';

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

  constructor(private _auth: AuthService,
              private _uiS: UiServiceService,
              private modalCtrl: ModalController) { }

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
