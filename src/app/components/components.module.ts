import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarSelectorComponent } from './avatar-selector/avatar-selector.component';
import { IonicModule } from '@ionic/angular';
import { HeaderComponent } from './header/header.component';
import { ItemSalaComponent } from './item-sala/item-sala.component';



@NgModule({
  declarations: [
    AvatarSelectorComponent,
    HeaderComponent,
    ItemSalaComponent
  ],
  exports: [
    AvatarSelectorComponent,
    HeaderComponent,
    ItemSalaComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
})
export class ComponentsModule { }
