import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChatModalComponent } from './chat-modal.component';

@NgModule({
  declarations: [
    ChatModalComponent, // Asegúrate de que ChatModalComponent esté aquí
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Asegúrate de que esto esté aquí
  ]
})
export class ChatModalModule { }
