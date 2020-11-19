import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController, IonInput } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-otra-password',
  templateUrl: './otra-password.component.html',
  styleUrls: ['./otra-password.component.scss'],
})
export class OtraPasswordComponent implements OnInit {
  @Input() email;
  @ViewChild('slide') slides: IonSlides;
  @ViewChild('input') input: IonInput;



  constructor(private modalCtrl: ModalController) { }


  ngOnInit() {
    setTimeout( () => {
      this.input.setFocus();
    }, 250);
  }

  ngAfterViewInit(){
    this.slides.lockSwipes( true );
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  solicitarPass(form: NgForm) {
    if (form.invalid) {
      return;
    } else {
      this.modalCtrl.dismiss({email: this.email});
    }
  }

}
