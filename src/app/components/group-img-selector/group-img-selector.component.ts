import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-group-img-selector',
  templateUrl: './group-img-selector.component.html',
  styleUrls: ['./group-img-selector.component.scss'],
})
export class GroupImgSelectorComponent implements OnInit {
  @Output() avatarSel = new EventEmitter<string>();
  @Input() av;

  avatars = [
    {
      img: 'group_1.png',
      seleccionado: false
    },
    {
      img: 'group_2.png',
      seleccionado: false
    },
    {
      img: 'group_3.png',
      seleccionado: false
    },
    {
      img: 'group_4.png',
      seleccionado: false
    },
    {
      img: 'group_5.png',
      seleccionado: false
    },
    {
      img: 'group_6.png',
      seleccionado: false
    },
    {
      img: 'group_7.png',
      seleccionado: false
    },
    {
      img: 'group_8.png',
      seleccionado: false
    },
    {
      img: 'group_9.png',
      seleccionado: false
    },
    {
      img: 'group_10.png',
      seleccionado: false
    },
    {
      img: 'group_11.png',
      seleccionado: false
    },
    {
      img: 'group_12.png',
      seleccionado: false
    },
    {
      img: 'group_13.png',
      seleccionado: false
    },
    {
      img: 'group_14.png',
      seleccionado: false
    },
    {
      img: 'group_15.png',
      seleccionado: false
    },
    {
      img: 'group_16.png',
      seleccionado: false
    },
    {
      img: 'group_17.png',
      seleccionado: false
    },
    {
      img: 'group_18.png',
      seleccionado: false
    },
    {
      img: 'group_19.png',
      seleccionado: false
    },
    {
      img: 'group_20.png',
      seleccionado: false
    },
    {
      img: 'group_21.png',
      seleccionado: false
    },
    {
      img: 'group_22.png',
      seleccionado: false
    },
    {
      img: 'group_23.png',
      seleccionado: false
    },
    {
      img: 'group_24.png',
      seleccionado: false
    },
    {
      img: 'group_25.png',
      seleccionado: false
    },
    {
      img: 'group_26.png',
      seleccionado: false
    },
    {
      img: 'group_27.png',
      seleccionado: false
    },
    {
      img: 'group_28.png',
      seleccionado: false
    },
    {
      img: 'group_29.png',
      seleccionado: false
    },
    {
      img: 'group_30.png',
      seleccionado: false
    },
    {
      img: 'group_31.png',
      seleccionado: false
    },
    {
      img: 'group_32.png',
      seleccionado: false
    },
    {
      img: 'group_33.png',
      seleccionado: false
    },
    {
      img: 'group_34.png',
      seleccionado: false
    },
    {
      img: 'group_35.png',
      seleccionado: false
    },
    {
      img: 'group_36.png',
      seleccionado: false
    },
    {
      img: 'group_37.png',
      seleccionado: false
    },
    {
      img: 'default.png',
      seleccionado: false
    }
  ];

  avatarSlide = {
    slidesPerView: ((Math.trunc(window.innerWidth / 100) + 0.5) > 7.5) ? 7.5 : (Math.trunc(window.innerWidth / 100) + 0.5)
  };

  @ViewChild(IonSlides, {static: false}) slides: IonSlides;

  constructor() { }

  update() {
    this.slides.update();
    this.select();
  }

  ngOnInit() {
    this.avatars.forEach( av => av.seleccionado = false);
    for ( const avatar of this.avatars) {
      if (avatar.img === this.av) {
        avatar.seleccionado = true;
        break;
      }
    }
  }


  select() {
    let i = 0;
    for ( const avatar of this.avatars) {
      if (avatar.img === this.av) {
        if (i > 7) {
          this.slides.slideTo(i - 3);
        }
        break;
      }
      i++;
    }
  }

  seleccionarAvatar( avatar ) {
    this.avatars.forEach( av => av.seleccionado = false);
    avatar.seleccionado = true;
    this.avatarSel.emit(avatar.img);
  }

}
