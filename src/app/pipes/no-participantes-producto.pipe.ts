import { Pipe, PipeTransform } from '@angular/core';
import { SalaService } from '../services/sala.service';

@Pipe({
  name: 'noParticipantesProducto',
  pure: false
})
export class NoParticipantesProductoPipe implements PipeTransform {
  
  constructor(private _sala: SalaService) { }

  transform(participantes: string[]): string[] {
    // console.log('ENTRO');
    const noParticipantes = [];
    this._sala.infoSala.participantes.forEach(idUser => {
      if (!participantes.includes(idUser)) {
        noParticipantes.unshift(idUser);
      }
    });
    return noParticipantes;
  }

}
