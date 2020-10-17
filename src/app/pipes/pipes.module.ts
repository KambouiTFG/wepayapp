import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoParticipantesProductoPipe } from './no-participantes-producto.pipe';



@NgModule({
  declarations: [
    NoParticipantesProductoPipe
  ],
  exports: [
    NoParticipantesProductoPipe
  ],
  imports: [
    CommonModule
  ]
})
export class PipesModule { }
