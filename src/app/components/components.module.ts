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
import { AjustesSalaComponent } from './ajustes-sala/ajustes-sala.component';
import { ChatComponent } from './chat/chat.component';
import { OtraPasswordComponent } from './otra-password/otra-password.component';
import { ResumeComponent } from './resume/resume.component';
import { GroupImgSelectorComponent } from './group-img-selector/group-img-selector.component';
import { MisGastosComponent } from './mis-gastos/mis-gastos.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    HeaderComponent,
    ItemSalaComponent,
    ParticipantesComponent,
    ListaProductosComponent,
    ModalProductoComponent,
    ModalCrearProductoComponent,
    AjustesSalaComponent,
    ChatComponent,
    OtraPasswordComponent,
    ResumeComponent,
    GroupImgSelectorComponent,
    MisGastosComponent
    ],
  exports: [
    AvatarSelectorComponent,
    HeaderComponent,
    ItemSalaComponent,
    ParticipantesComponent,
    ListaProductosComponent,
    AjustesSalaComponent,
    ChatComponent,
    OtraPasswordComponent,
    ResumeComponent,
    GroupImgSelectorComponent,
    MisGastosComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PipesModule

  ],
})
export class ComponentsModule { }
