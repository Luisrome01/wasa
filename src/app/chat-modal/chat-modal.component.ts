import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-chat-modal',
  templateUrl: './chat-modal.component.html',
  styleUrls: ['./chat-modal.component.scss'],
})
export class ChatModalComponent implements OnInit {
  @Input() chatId!: string; // Asegúrate de que este valor se inicialice correctamente
  messages: any[] = []; // Inicializado como array vacío

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    if (this.chatId) {
      console.log('Chat ID received:', this.chatId); // Agregado para depuración
      this.fetchMessages();
    } else {
      console.error('No chatId provided');
    }
  }

  async fetchMessages() {
    const authToken = localStorage.getItem('authToken');
    console.log('Auth Token:', authToken);
    console.log('Fetching messages for chat ID:', this.chatId);
  
    try {
      const response = await fetch(`https://backend-wassapp-4.onrender.com/api/chats/${this.chatId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log('Fetched data:', data); // Agregado para depuración
  
      // Asegúrate de que `messages` es un array
      if (data && Array.isArray(data.messages)) {
        this.messages = data.messages;
      } else {
        console.error('Fetched data.messages is not an array:', data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }
  

  closeModal() {
    this.modalController.dismiss();
  }
}
