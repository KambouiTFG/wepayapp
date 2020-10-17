import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { ItemSalaComponent } from './item-sala/item-sala.component';
import { ParticipantesComponent } from './participantes/participantes.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { ModalProductoComponent } from './modal-producto/modal-producto.component';
import { ModalCrearProductoComponent } from './modal-crear-producto/modal-crear-producto.component';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../pipes/pipes.module';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    HeaderComponent,
    ItemSalaComponent,
    ParticipantesComponent,
    ListaProductosComponent,
    ModalProductoComponent,
    ModalCrearProductoComponent
    ],
  exports: [
    AvatarSelectorComponent,
    HeaderComponent,
    ItemSalaComponent,
    ParticipantesComponent,
    ListaProductosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipesModule

  ],
})
export class ComponentsModule { }
