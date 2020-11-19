import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-avatar-selector',
  templateUrl: './avatar-selector.component.html',
  styleUrls: ['./avatar-selector.component.scss'],
})
export class AvatarSelectorComponent implements OnInit {
  @Output() avatarSel = new EventEmitter<string>();
  @Input() av = 'av-1.png';

  avatars = [
    {
      img: 'av-1.png',
      seleccionado: true
    },
    {
      img: 'av-2.png',
      seleccionado: false
    },
    {
      img: 'av-3.png',
      seleccionado: false
    },
    {
      img: 'av-4.png',
      seleccionado: false
    },
    {
      img: 'av-5.png',
      seleccionado: false
    },
    {
      img: 'av-6.png',
      seleccionado: false
    },
    {
      img: 'av-7.png',
      seleccionado: false
    },
    {
      img: 'av-8.png',
      seleccionado: false
    },
    {
      img: 'av_9.png',
      seleccionado: false
    },
    {
      img: 'av_10.png',
      seleccionado: false
    },
    {
      img: 'av_11.png',
      seleccionado: false
    },
    {
      img: 'av_12.png',
      seleccionado: false
    },
    {
      img: 'av_13.png',
      seleccionado: false
    },
    {
      img: 'av_14.png',
      seleccionado: false
    },
    {
      img: 'av_15.png',
      seleccionado: false
    },
    {
      img: 'av_16.png',
      seleccionado: false
    },
    {
      img: 'av_17.png',
      seleccionado: false
    },
    {
      img: 'av_18.png',
      seleccionado: false
    },
    {
      img: 'av_19.png',
      seleccionado: false
    },
    {
      img: 'av_20.png',
      seleccionado: false
    },
    {
      img: 'av_21.png',
      seleccionado: false
    },
    {
      img: 'av_22.png',
      seleccionado: false
    },
    {
      img: 'av_23.png',
      seleccionado: false
    },
    {
      img: 'av_24.png',
      seleccionado: false
    },
    {
      img: 'av_25.png',
      seleccionado: false
    },
    {
      img: 'av_26.png',
      seleccionado: false
    },
    {
      img: 'av_27.png',
      seleccionado: false
    },
    {
      img: 'av_28.png',
      seleccionado: false
    },
    {
      img: 'av_29.png',
      seleccionado: false
    },
    {
      img: 'av_30.png',
      seleccionado: false
    },
    {
      img: 'av_31.png',
      seleccionado: false
    },
    {
      img: 'av_32.png',
      seleccionado: false
    }
];

avatarSlide = {
  slidesPerView: ((Math.trunc(window.innerWidth / 100) + 0.5) > 6.5) ? 6.5 : (Math.trunc(window.innerWidth / 100) + 0.5)
};
  constructor() { }

  ngOnInit() {
    this.avatars.forEach( av => av.seleccionado = false);
    for ( const avatar of this.avatars) {
      if (avatar.img === this.av) {
        avatar.seleccionado = true;
        break;
      }
    }
  }

  seleccionarAvatar( avatar ) {
    this.avatars.forEach( av => av.seleccionado = false);
    avatar.seleccionado = true;
    this.avatarSel.emit(avatar.img);
  }
}
