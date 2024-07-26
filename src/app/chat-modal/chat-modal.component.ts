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
      this.fetchMessages();
    } else {
      console.error('No chatId provided');
    }
  }

  async fetchMessages() {
    const authToken = localStorage.getItem('authToken');
    try {
      const response = await fetch(`http://localhost:8000/api/chats/${this.chatId}/messages`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      this.messages = await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
