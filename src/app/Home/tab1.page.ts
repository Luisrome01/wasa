import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatModalComponent } from '../chat-modal/chat-modal.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  chats: any[] = [];
  private apiUrl = 'https://backend-wassapp-4.onrender.com/api/chats'; // Ajusta la URL según tu backend

  constructor(private modalController: ModalController) { }

  ngOnInit() {
    this.fetchChats();
  }

  async fetchChats() {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Fetched chats:', data); // Agregado para depuración

      // Ordenar los chats alfabéticamente por el email del miembro
      this.chats = data
        .sort((a: any, b: any) => {
          const emailA = a.member?.email?.toLowerCase() || '';
          const emailB = b.member?.email?.toLowerCase() || '';
          // Ordenar alfabéticamente
          return emailA.localeCompare(emailB);
        })
        .sort((a: any, b: any) => {
          const nameA = a.member?.email || 'No member info';
          const nameB = b.member?.email || 'No member info';
          // Mover los chats sin información al final
          return nameA === 'No member info' ? 1 : nameB === 'No member info' ? -1 : 0;
        });

      // Guardar los chats en localStorage
      localStorage.setItem('chats', JSON.stringify(this.chats));

    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  }

  async openChatModal(chatId: string) {
    // Leer los chats desde localStorage
    const storedChats = localStorage.getItem('chats');
    let chatData = [];
  
    if (storedChats) {
      chatData = JSON.parse(storedChats);
    }
  
    // Buscar el chat correspondiente al chatId
    const chat = chatData.find((c: any) => c.member?._id === chatId || c.member?.email === chatId);
  
    if (chat) {
      // Crear el modal con el chat ID
      const modal = await this.modalController.create({
        component: ChatModalComponent,
        componentProps: { chatId: chat.chat } // Pasar el chat ID al modal
      });
      return await modal.present();
    } else {
      console.error('Chat not found for the provided chatId');
    }
  }
  
}
